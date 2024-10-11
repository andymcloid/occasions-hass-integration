class OccasionsCardEditor extends HTMLElement {
    constructor() {
        super();
        this._config = {};
    }

    setConfig(config) {
        this._config = config;
        this.renderEditor();
    }

    renderEditor() {
        if (!this.content) {
            this.content = document.createElement('div');
            this.appendChild(this.content);
        }

        const occasions = this._config.occasions || [];

        this.content.innerHTML = `
            <h3>Configure Occasions</h3>
            ${occasions.map((occasion, index) => `
                <div>
                    <label>Name: <input type="text" value="${occasion.name}" onchange="this.updateName(event, ${index})"></label>
                    <label>Date: <input type="date" value="${occasion.date}" onchange="this.updateDate(event, ${index})"></label>
                    <label>Icon: <input type="text" value="${occasion.icon}" onchange="this.updateIcon(event, ${index})"></label>
                </div>
            `).join('')}
            <button type="button" onclick="this.addOccasion()">Add Occasion</button>
        `;
    }

    updateName(event, index) {
        this._config.occasions[index].name = event.target.value;
        this._updateConfig();
    }

    updateDate(event, index) {
        this._config.occasions[index].date = event.target.value;
        this._updateConfig();
    }

    updateIcon(event, index) {
        this._config.occasions[index].icon = event.target.value;
        this._updateConfig();
    }

    addOccasion() {
        if (!this._config.occasions) {
            this._config.occasions = [];
        }
        this._config.occasions.push({ name: '', date: '', icon: 'mdi:calendar' });
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

customElements.define('occasions-card-editor', OccasionsCardEditor);
