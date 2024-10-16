import { LitElement, html, css } from 'https://unpkg.com/lit@2.2.7/index.js?module';

export class OccasionsCardEditor extends LitElement  {
    constructor() {
        super();
        this._hass = null;
        this.config = { occasions: [] };
        this.schema = [
          { name: 'name', selector: { text: {} } },
          { name: 'date', selector: { date: {} } },
          { name: 'icon', selector: { icon: {} } },
        ];

      this.schema = [
        { name: 'title', selector: { text: {} } },
        { name: 'energy_date_selection', selector: { boolean: {} } },
        {
          type: 'grid',
          name: '',
          schema: [
            { name: 'time_period_from', selector: { text: {} } },
            { name: 'time_period_to', selector: { text: {} } },
            { name: 'show_names', selector: { boolean: {} } },
            { name: 'show_icons', selector: { boolean: {} } },
            { name: 'show_states', selector: { boolean: {} } },
            { name: 'show_units', selector: { boolean: {} } },
            {
              name: 'layout',
              selector: {
                select: {
                  mode: 'dropdown',
                  options: [
                    { value: 'auto', label: 'xyz' },
                    { value: 'horizontal', label: 'xyz' },
                    { value: 'vertical', label: 'xyz' },
                  ],
                },
              },
            },
            { name: 'wide', selector: { boolean: {} } },
            { name: 'height', selector: { number: { mode: 'box', unit_of_measurement: 'px' } } },
            { name: 'min_box_size', selector: { number: { mode: 'box', unit_of_measurement: 'px' } } },
            { name: 'min_box_distance', selector: { number: { mode: 'box', unit_of_measurement: 'px' } } },
          ],
        },
        {
          type: 'grid',
          name: '',
          schema: [
            { name: 'min_state', selector: { number: { mode: 'box', min: 0, step: 'any' } } },
            { name: 'static_scale', selector: { number: { mode: 'box' } } },
            { name: 'round', selector: { number: { mode: 'box', unit_of_measurement: 'xyz' } } },
           
            {
              name: 'sort_by',
              selector: {
                select: {
                  mode: 'dropdown',
                  options: [
                    { value: 'none', label: 'xyz' },
                    { value: 'state', label: 'xyz' },
                  ],
                },
              },
            },
            {
              name: 'sort_dir',
              selector: {
                select: {
                  mode: 'dropdown',
                  options: [
                    { value: '' },
                    { value: 'desc', label: 'desc' },
                    { value: 'asc', label: 'asc' },
                  ],
                },
              },
            },
            { name: 'throttle', selector: { number: { mode: 'box', unit_of_measurement: 'ms' } } },
          ],
        },
      ];


        this._editIndex = null; // Track the index of the item being edited
    }

    static get properties() {
        return {
          _hass: { type: Object },  // Home Assistant object
          config: { type: Object },  // Configuration object
          schema: { type: Array },  // Schema for the ha-form fields
          _editIndex: { type: Number },  // Track the currently edited item
        };
      }


    static styles = css`
      div {
        padding: 10px;
      }
      mwc-icon-button {
        vertical-align: middle;
      }
    `;

    setConfig(config) {
        this.config = config || { occasions: [] };
        if (!this.config.occasions) {
            this.config.occasions = [];
        }
        this.render(); // Trigger re-render when config is set
    }
    set hass(hass) {
        this._hass = hass;
        this.render(); // Trigger re-render when hass is set
    }


    render() {

        // Make sure necessary data is available
        if (!this._hass || !this.config || !this.schema) {
            return;
        }

        return html`
            <div class="card-config">
            <div class="options">
            <div class="autoconfig">
              <ha-form-grid
                  .hass=${this.hass}
                  .data=${this.config.occasions[this._editIndex]}
                  .schema=${this.schema}
                  @value-changed=${this._valueChanged}
                ></ha-form-grid>
            </div>
            </div>
            </div>
        `;

      }

      _editOccasion(index) {
        this._editIndex = index;
      }

      _addOccasion() {
        this.config.occasions.push({
          name: '',
          date: '',
          icon: '',
        });
        this._editIndex = this.config.occasions.length - 1; // Set the new occasion to be edited
      }

      _valueChanged(event) {
        const updatedValue = event.detail.value;
        this.config.occasions[this._editIndex] = {
          ...this.config.occasions[this._editIndex],
          ...updatedValue,
        };

        // Dispatch config-changed event
        this.dispatchEvent(
          new CustomEvent('config-changed', {
            detail: { config: this.config },
            bubbles: true,
            composed: true,
          })
        );
      }
}