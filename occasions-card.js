class OccasionsCard extends HTMLElement {
    set hass(hass) {
        if (!this.content) {
            const card = document.createElement('ha-card');
            card.header = this.config.title || 'Occasions';
            this.content = document.createElement('div');
            this.content.style.padding = '0 16px 16px';
            card.appendChild(this.content);
            this.appendChild(card);
        }

        // Get the list of occasions from config
        const occasions = this.config.occasions || [];
        const numberOfDays = this.config.numberofdays || 365; //TODO: Implement property 
 
        const current = new Date();
        const currentDayTS = new Date(current.getFullYear(), current.getMonth(), current.getDate()).getTime();
        const oneDay = 86400000; // 24 * 60 * 60 * 1000

        const updatedOccasions = occasions.map(occasion => {
            const clonedOccasion = { ...occasion }; // Clone the object to avoid modifying the original
            const occasionDate = new Date(clonedOccasion.date);
            const occasionMonth = occasionDate.getMonth();
            const occasionDay = occasionDate.getDate();

            const birthdayPassed = (occasionMonth < current.getMonth()) || 
                                   (occasionMonth === current.getMonth() && occasionDay < current.getDate());
            const yearToAdd = birthdayPassed ? 1 : 0;
            clonedOccasion.ts = new Date(current.getFullYear() + yearToAdd, occasionMonth, occasionDay).getTime();
            clonedOccasion.diff = Math.round(Math.abs((currentDayTS - clonedOccasion.ts) / oneDay));

            if (clonedOccasion.diff > numberOfDays) clonedOccasion.ts = 0;

            return clonedOccasion;
        });

        const sortedOccasions = updatedOccasions
            .filter(occasion => occasion.ts !== 0)
            .sort((a, b) => a.ts - b.ts);

        const occasionsToday = this.generateOccasionHtml(
            sortedOccasions.filter(occasion => occasion.diff === 0), 
            "Idag", true
        );
        const upcomingOccasions = this.generateOccasionHtml(
            sortedOccasions.filter(occasion => occasion.diff > 0), 
            "Imorgon", false
        );
 
        this.content.innerHTML = `
            <style>
                .bd-wrapper { padding: 5px; margin-bottom: 5px; }
                .bd-divider { height: 1px; border-bottom: 1px solid rgba(127, 127, 127, 0.7); margin-bottom: 5px; }
                .bd-today { font-weight: bold; }
                .ha-icon { display: inline-block; height: 20px; width: 20px; margin: 0 17px 0 5px; color: var(--paper-item-icon-color); }
                .ha-icon.on { color: #ffd700; }
                .bd-name { display: inline-block; padding-left: 10px; padding-top: 2px; }
                .bd-none { color: var(--paper-item-icon-color); }
                .bd-when { display: inline-block; float: right; font-size: smaller; padding-top: 3px; }
            </style>
            ${occasionsToday || upcomingOccasions ? 
                `${occasionsToday}<div class='bd-divider'></div>${upcomingOccasions}` : 
                `<div class='bd-none'>No occations in ${numberOfDays} days</div>`
            }
        `;
    }

    generateOccasionHtml(occasionList, todayText, isToday) {
        return occasionList.map(occasion => `
            <div class='bd-wrapper ${isToday ? 'bd-today' : ''}'>
                <ha-icon class='ha-icon ${isToday ? 'on' : ''}' icon='${occasion.icon || (isToday ? "mdi:crown" : "mdi:calendar-clock")}'></ha-icon>
                <div class='bd-name'>${occasion.name}</div>
                <div class='bd-when'>${isToday ? todayText : `in ${occasion.diff} days`}</div>
            </div>
        `).join("");
    }

    setConfig(config) {
        this.config = config;
    }

    static getConfigElement() {
        return document.createElement("occasions-card-editor");
    }

    static getStubConfig() {
        return {
            occasions: [
                { name: "Birthday", date: "2024-05-20", icon: "mdi:cake" }
            ]
        };
    }

    getCardSize() {
        return 3;
    }
}

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
customElements.define('occasions-card', OccasionsCard);
