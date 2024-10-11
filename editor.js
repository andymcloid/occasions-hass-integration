class OccasionsCardEditor extends HTMLElement {
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
            <div id="occasion-list">
                ${occasions.map((occasion, index) => `
                    <div style="margin-bottom: 10px;">
                        <label>Name: <input type="text" value="${occasion.name || ''}" onchange="this.updateName(event, ${index})"></label>
                        <label>Date: <input type="date" value="${occasion.date || ''}" onchange="this.updateDate(event, ${index})"></label>
                        <label>Icon: <input type="text" value="${occasion.icon || ''}" onchange="this.updateIcon(event, ${index})"></label>
                        <button type="button" onclick="this.removeOccasion(${index})">Remove</button>
                    </div>
                `).join('')}
            </div>
            <button type="button" onclick="this.addOccasion()">Add Occasion</button>
        `;
    }

    addOccasion() {
        this._config.occasions.push({ name: '', date: '', icon: 'mdi:calendar' });
        this._updateConfig();
        this.renderEditor();
    }

    removeOccasion(index) {
        this._config.occasions.splice(index, 1);
        this._updateConfig();
        this.renderEditor();
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

customElements.define('occasions-card-editor', OccasionsCardEditor);
