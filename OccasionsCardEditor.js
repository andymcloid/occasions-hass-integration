import { LitElement, html, css } from 'https://unpkg.com/lit@2.2.7/index.js?module';

export class OccasionsCardEditor extends LitElement  {
    constructor() {
        super();
        this._hass = null;
        this.config = { occasions: [] };
        this._editIndex = null; // Track the index of the item being edited
    }

    static get properties() {
        return {
          _hass: { type: Object },  // Home Assistant object
          _editIndex: { type: Number },  // Track the currently edited item
          config: { type: Object },  // Configuration object
          schemaBase: { type: Array },  // Schema
          occasionSchema: { type: Array },  // Schema
        };
      }

    get schemaBase() {
        return [
            { name: 'title', selector: { text: {} } },
        ];
    }
    
    get occasionSchema() {
        return [
            { name: 'name', label: 'xxx', selector: { text: {} } },
            { name: 'date', label: 'xxx', selector: { date: {} } },
            { name: 'icon', label: 'xxx', selector: { icon: {} } },
            { name: 'hide_count', text: 'asd', data: 'asddas', label: 'xxx', selector: { boolean: {} } }
        ];
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
        if (!this._hass || !this.config) {
            return;
        }

        return html`
            <ha-form .hass=${this._hass} .data=${this.config} .schema=${this.schemaBase} @value-changed=${this._valueChanged}></ha-form>
            <div></div>
            ${this.config.occasions.map((occasion, index) => html`
            
            <ha-expansion-panel outlined="true" header="${occasion.name}">
            <div></div>
            <ha-form
                .hass=${this._hass}
                .data=${occasion}
                .schema=${this.occasionSchema}
                .key=${index}
                @value-changed=${e => this._occasionChanged(e, index)}
            ></ha-form>
            </ha-expansion-panel>
            `)}
            
            <mwc-button @click=${this._addOccasion}>Add Occasion</mwc-button>
        `;
    }

    _occasionChanged(event, index) {
        const newValue = event.detail.value;
        const newOccasions = [...this.config.occasions];
        newOccasions[index] = newValue;
        this.config = { ...this.config, occasions: newOccasions };
        this._requestUpdate();
    }

    _valueChanged(event) {
        const updatedValue = event.detail.value;
        this.config = { ...this.config, ...updatedValue };
        this._requestUpdate();
    }

    _requestUpdate() {
        // Dispatch config-changed event
        this.dispatchEvent( new CustomEvent('config-changed', { detail: { config: this.config }, bubbles: true, composed: true, }));
    }

    _editOccasion(index) {
        this._editIndex = index;
    }

    _addOccasion() {
        this.config.occasions.push({
            name: 'New Event',
            date: new Date().toISOString().substring(0,10),
            icon: 'mdi:calendar',
            count: false
        });
    }

}