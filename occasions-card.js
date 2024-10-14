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

        // Translations
        const lz_year = hass.localize("ui.components.time.duration.year");
        const lz_days = hass.localize("ui.components.time.duration.days");
        const lz_today = hass.localize("ui.components.relative_time.today");
        const lz_tomorrow = hass.localize("ui.components.relative_time.tomorrow");

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
            clonedOccasion.age = 0;

            // Default true if not set.
            if (clonedOccasion.count === undefined)
                clonedOccasion.count = true;

            const birthdayPassed = (occasionMonth < current.getMonth()) || 
                                   (occasionMonth === current.getMonth() && occasionDay < current.getDate());
            const yearToAdd = birthdayPassed ? 1 : 0;
            if (occasionDate.getFullYear() > 0)
				clonedOccasion.age = current.getFullYear() - occasionDate.getFullYear() + yearToAdd;


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
            lz_today, true
        );
        const upcomingOccasions = this.generateOccasionHtml(
            sortedOccasions.filter(occasion => occasion.diff > 0), 
            lz_tomorrow, false
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
                <div class='bd-name'>${occasion.name} ${occasion.count ? '(' + occasion.age + ' ' + lz_year + ')' : ''}</div>
                <div class='bd-when'>${isToday ? todayText : `${occasion.diff} ${lz_days}`}</div>
            </div>
        `).join("");
    }
  
    setConfig(config) {
        this.config = config;
    }
  
    // static getConfigElement() {
    //     return document.createElement("occasions-card-editor");
    // }
  
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

// class OccasionsCardEditor extends HTMLElement {
//     setConfig(config) {
//         this._config = config || { occasions: [] };
//         if (!this._config.occasions) {
//             this._config.occasions = [];
//         }
//         this.render();
//     }

//     render() {
//         this.innerHTML = `
//             <div>
//                 <ha-form
//                     .schema=${[
//                         { name: "name", selector: { text: {} } },
//                         { name: "date", selector: { date: {} } },
//                         { name: "icon", selector: { icon: {} } }
//                     ]}
//                     .data=${this._config.occasions[0] || {}}
//                     @value-changed=${this._valueChanged}
//                 ></ha-form>
//                 <button type="button" id="add-occasion">Add Occasion</button>
//             </div>
//         `;

//         this.querySelector("#add-occasion").addEventListener("click", () => this.addOccasion());
//     }

//     _valueChanged(event) {
//         if (!this._config.occasions) {
//             this._config.occasions = [];
//         }
//         this._config.occasions[0] = event.detail.value;
//         const newEvent = new Event("config-changed", {
//             bubbles: true,
//             composed: true
//         });
//         newEvent.detail = { config: this._config };
//         this.dispatchEvent(newEvent);
//     }

//     addOccasion() {
//         if (!this._config.occasions) {
//             this._config.occasions = [];
//         }
//         this._config.occasions.push({ name: '', date: '', icon: 'mdi:calendar' });
//         this.render();
//     }
    
// }


//customElements.define('occasions-card-editor', OccasionsCardEditor);
customElements.define('occasions-card', OccasionsCard);