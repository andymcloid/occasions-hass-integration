/*
     █████   █████  ██████  ██████ █████ █████  █████  █     █ █████   █████  ██████ █████  ██████  
    █     █ █     █ █     █ █    █ █       █   █     █ ███   █ █      █     █ █    █ █    █ █     █ 
    █     █ █       █       ██████ █████   █   █     █ █ ██  █ █████  █       ██████ █████  █     █ 
    █     █ █     █ █     █ █    █     █   █   █     █ █  ██ █     █  █     █ █    █ █   █  █     █
     █████   █████  ██████  █    █ █████ █████  █████  █    ██ █████   █████  █    █ █    █ ██████  
     Copyright AndyMcLoid (c) 2024
*/

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
            ${occasionsToday ? `${occasionsToday}${upcomingOccasions ? "<div class='bd-divider'></div>" + upcomingOccasions : ""}` : 
                upcomingOccasions ? upcomingOccasions : 
                `<div class='bd-none'>No occasions in ${numberOfDays} days</div>`}
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

customElements.define('occasions-card-editor', OccasionsCardEditor);
customElements.define('occasions-card', OccasionsCard);
