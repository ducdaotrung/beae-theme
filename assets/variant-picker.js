class VariantPicker extends HTMLElement {
  connectedCallback() {
    this.variants = JSON.parse(this.dataset.variants || '[]');
    this.fields = [...this.querySelectorAll('[data-option-index]')];
    this.idInput = this.querySelector('[data-variant-id]');
    this.fields.forEach((field) => {
      field.addEventListener('click', (event) => {
        const button = event.target.closest('[data-option-value].variant-picker__button');
        if (button && button.getAttribute('aria-disabled') !== 'true') this.setValue(field, button.dataset.optionValue);
      });
      field.addEventListener('change', (event) => {
        if (event.target.matches('[data-option-value]')) this.setValue(field, event.target.value);
      });
    });
    this.sync();
  }

  setValue(field, value) {
    field.querySelectorAll('.variant-picker__button').forEach((button) => {
      const isSelected = button.dataset.optionValue === value;
      button.classList.toggle('is-selected', isSelected);
      button.setAttribute('aria-pressed', String(isSelected));
    });
    const control = field.querySelector('select[data-option-value]');
    if (control) control.value = value;
    this.sync();
  }

  values() {
    return this.fields.map((field) => {
      const selected = field.querySelector('.variant-picker__button.is-selected');
      const select = field.querySelector('select[data-option-value]');
      return selected ? selected.dataset.optionValue : select?.value;
    });
  }

  sync() {
    const values = this.values();
    const selected = this.variants.find((variant) => variant.options.every((value, index) => value === values[index])) || this.variants.find((variant) => variant.available);
    if (!selected) return;
    this.idInput.value = selected.id;
    this.dataset.selectedVariant = selected.id;
    this.fields.forEach((field, index) => {
      const value = selected.options[index];
      field.querySelectorAll('.variant-picker__button').forEach((button) => {
        const isSelected = button.dataset.optionValue === value;
        button.classList.toggle('is-selected', isSelected);
        button.setAttribute('aria-pressed', String(isSelected));
        const possible = this.variants.some((variant) => variant.options[index] === button.dataset.optionValue && variant.available);
        button.classList.toggle('is-unavailable', !possible);
        button.setAttribute('aria-disabled', String(!possible));
      });
      const select = field.querySelector('select[data-option-value]');
      if (select) select.value = value;
      const label = field.querySelector('.variant-picker__selected-value');
      if (label) label.textContent = `: ${value}`;
    });
    this.idInput.dispatchEvent(new Event('change', { bubbles: true }));
    this.syncMedia(selected);
    this.dispatchEvent(new CustomEvent('variant:change', { bubbles: true, detail: { variant: selected } }));
  }

  syncMedia(variant) {
    if (this.dataset.filterMedia !== 'true') return;
    const mediaId = variant.featured_media?.id;
    document.querySelectorAll('[data-product-media]').forEach((media, index) => {
      media.hidden = mediaId ? media.dataset.productMedia !== String(mediaId) : index > 0;
    });
  }
}

customElements.define('variant-picker', VariantPicker);

document.addEventListener('variant:change', (event) => {
  const price = document.querySelector('[data-price-context="product_page"]');
  const dataElement = price?.querySelector('[data-price-variants]');
  const variant = event.detail?.variant;
  if (!price || !dataElement || !variant) return;

  const variantData = JSON.parse(dataElement.textContent || '{}')[String(variant.id)];
  if (!variantData) return;

  const current = price.querySelector('[data-price-current]');
  const compare = price.querySelector('[data-price-compare]');
  const unit = price.querySelector('[data-price-unit]');
  const status = price.querySelector('[data-price-status]');
  const isSale = variantData.compare_at_price !== '';

  current.textContent = variantData.price;
  current.toggleAttribute('aria-label', isSale);
  if (isSale) current.setAttribute('aria-label', 'Sale price');
  compare.textContent = variantData.compare_at_price;
  compare.hidden = !isSale;
  unit.textContent = variantData.unit_price ? `${variantData.unit_price} / ${variantData.unit_reference === 1 ? '' : variantData.unit_reference}${variantData.unit}` : '';
  unit.hidden = !variantData.unit_price;
  status.hidden = variantData.available;
  price.dataset.priceVariantId = String(variant.id);
  price.classList.toggle('price--sale', isSale);
  price.classList.toggle('price--regular', !isSale);
});
