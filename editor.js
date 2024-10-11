export class OccasionsCardEditor extends HTMLElement {
    constructor() {
        super();
        this._config = {};
    }

    setConfig(config) {
        this._config = config || { occasions: [] };
        this.renderEditor();
    }

    renderEditor() {
        if (!this.content) {
            this.content = document.createElement('div');
            this.appendChild(this.content);
        }

        const occasions = this._config.occasions || [];

        // Clear content and re-render it
        this.content.innerHTML = `
            <h3>Configure Occasions</h3>
            <div id="occasion-list"></div>
            <ha-form>
                <ha-formfield label="Occasion Name">
                    <input type="text" id="occasion-name" placeholder="Enter Occasion Name">
                </ha-formfield>
                <ha-formfield label="Date">
                    <input type="date" id="occasion-date">
                </ha-formfield>
                <ha-entity-picker label="Select Entity" id="entity-picker" allow-custom-entity></ha-entity-picker>
            </ha-form>
            <button type="button" id="add-occasion">Add Occasion</button>
            <ul id="occasion-list"></ul>
        `;

        const occasionList = this.content.querySelector("#occasion-list");

        occasions.forEach((occasion, index) => {
            const occasionDiv = document.createElement('li');
            occasionDiv.innerHTML = `
                ${occasion.name} - ${occasion.date} <button type="button" data-index="${index}" class="remove-occasion">Remove</button>
            `;

            occasionList.appendChild(occasionDiv);
        });

        // Add event listeners
        this.content.querySelector("#add-occasion").addEventListener('click', this.addOccasion.bind(this));
        this.content.querySelectorAll('.remove-occasion').forEach(button => {
            button.addEventListener('click', (e) => this.removeOccasion(e));
        });
    }

    addOccasion() {
        const nameInput = this.content.querySelector("#occasion-name");
        const dateInput = this.content.querySelector("#occasion-date");
        const entityPicker = this.content.querySelector("#entity-picker");

        this._config.occasions.push({
            name: nameInput.value,
            date: dateInput.value,
            icon: entityPicker.value || "mdi:calendar"
        });

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

    getConfig() {
        return this._config;
    }
}