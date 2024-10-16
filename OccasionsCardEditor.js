import { LitElement, html, css } from 'https://unpkg.com/lit@2.2.7/index.js?module';

export class OccasionsCardEditor extends LitElement  {
    constructor() {
        super();
        this._hass = null;
        this.config = { occasions: [] };
    }

    static get properties() {
        return {
          _hass: { type: Object },  // Home Assistant object
          config: { type: Object },  // Configuration object
          schemaBase: { type: Array },  // Schema
          occasionSchema: { type: Array },  // Schema
        };
      }
      
    get schemaBase() {
        return [
            { name: 'title', label: this._hass.localize('ui.panel.lovelace.editor.card.generic.title'), selector: { text: { } } },
            { name: 'numberofdays', label: this._hass.localize('ui.panel.lovelace.editor.card.generic.days_to_show'), selector: { number: {} } },
        ];
    }
   
    get occasionSchema() {
        return [
            { name: 'name', label: this._hass.localize('ui.common.name'), selector: { text: {} } },
            { name: 'date', label: this._hass.localize('ui.components.selectors.selector.types.date'), selector: { date: {} } },
            { name: 'icon', label:  this._hass.localize(' ui.panel.lovelace.editor.card.generic.icon'), selector: { icon: {} } },
            { name: 'hide_count', label: this._hass.localize('ui.common.hide') + ' ' + this._hass.localize('component.counter.entity_component._.name'), selector: { boolean: {} } }
        ];
    }

    static styles = css`
      div {
        padding: 10px;
      }
      mwc-icon-button {
        vertical-align: middle;
      }
      mwc-button.warning {
        --mdc-theme-primary: red; 
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
            <ha-form .hass=${this._hass} .data=${this.config} .computeLabel=${this._computeLabel} .schema=${this.schemaBase} @value-changed=${this._valueChanged}></ha-form>
            <div></div>
            ${this.config.occasions.map((occasion, index) => html`
            
            <ha-expansion-panel outlined="true" header="${occasion.name}" icon="mdi:bug">
            <div></div>
            <ha-form
                .hass=${this._hass}
                .data=${occasion}
                .computeLabel=${this._computeLabel}
                .schema=${this.occasionSchema}
                .key=${index}
                @value-changed=${e => this._occasionChanged(e, index)}
            ></ha-form>

            <mwc-button class="warning" @click=${() => this._deleteOccasion(index)}>${this._hass.localize('ui.components.todo.item.delete')}</mwc-button>
            <div></div>
            </ha-expansion-panel>
            `)}
            
            <mwc-button @click=${this._addOccasion}>${this._hass.localize('ui.components.todo.item.add')}</mwc-button>
        `;
    }

    _computeLabel(event, data) {
        if(event.label)
               return event.label;
        return event.name;
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

    _addOccasion() {
        this.config.occasions.push({
            name: 'New Event',
            date: new Date().toISOString().substring(0,10),
            icon: 'mdi:calendar',
            count: false
        });
        this._requestUpdate();
    }

    _deleteOccasion(index) {
        const newOccasions = [...this.config.occasions];
        newOccasions.splice(index, 1);
        this.config = { ...this.config, occasions: newOccasions };
        this._requestUpdate();
    }
}