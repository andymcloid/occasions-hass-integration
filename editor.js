export class OccasionsCardEditor extends HTMLElement {
    constructor() {
        super();
        this._config = {};
    }

    setConfig(config) {
        this._config = config || { occasions: [] };
        this.renderEditor();
    }

    async renderEditor() {
        if (!this.content) {
            this.content = document.createElement('div');
            this.appendChild(this.content);
        }

        const occasions = this._config.occasions || [];

        // Clear content and re-render it
        this.content.innerHTML = `
            <h3>Configure Occasions</h3>
            <div id="occasion-list"></div>
            <ha-form
                .schema=${[
                    { name: "name", selector: { text: {} } },
                    { name: "date", selector: { date: {} } },
                    { name: "icon", selector: { icon: {} } }
                ]}
                .data=${this._config}
                .computeLabel=${(schema) => schema.name}
                @value-changed=${this._valueChanged}
            >
            </ha-form>
            <button type="button" id="add-occasion">Add Occasion</button>
        `;

        const occasionList = this.content.querySelector("#occasion-list");

        // For each occasion, create an editable form using ha-form selectors
        occasions.forEach((occasion, index) => {
            const occasionDiv = document.createElement('li');
            occasionDiv.innerHTML = `
                <ha-form
                    .schema=${[
                        { name: "name", selector: { text: {} } },
                        { name: "date", selector: { date: {} } },
                        { name: "icon", selector: { icon: {} } }
                    ]}
                    .data=${occasion}
                    .computeLabel=${(schema) => schema.name}
                    @value-changed=${(e) => this._handleEdit(e, index)}
                ></ha-form>
                <button type="button" data-index="${index}" class="remove-occasion">Remove</button>
            `;

            occasionList.appendChild(occasionDiv);
        });

        // Add event listeners for adding/removing occasions
        this.content.querySelector("#add-occasion").addEventListener('click', this.addOccasion.bind(this));
        this.content.querySelectorAll('.remove-occasion').forEach(button => {
            button.addEventListener('click', (e) => this.removeOccasion(e));
        });
    }

    _handleEdit(event, index) {
        const field = event.detail.path;
        const value = event.detail.value;
        this._config.occasions[index][field] = value;
        this._updateConfig();
    }

    addOccasion() {
        this._config.occasions.push({ name: '', date: '', icon: 'mdi:calendar' });
        this._updateConfig();
        this.renderEditor();
    }

    removeOccasion(e) {
        const index = e.target.getAttribute('data-index');
        this._config.occasions.splice(index, 1);
        this._updateConfig();
        this.renderEditor();
    }

    _updateConfig() {
        const event = new Event('config-changed', {
            bubbles: true,
            composed: true
        });
        event.detail = { config: this._config };
        this.dispatchEvent(event);
    }
}