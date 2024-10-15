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
        const translations = {
            "days": hass.localize("ui.components.calendar.event.repeat.interval.daily"),
            "year": hass.localize("ui.components.calendar.event.rrule.year"),
            "years": hass.localize("ui.components.calendar.event.rrule.years"),
            "today": hass.localize("ui.components.date-range-picker.ranges.today"),
            "nonot": hass.localize("ui.notification_drawer.empty"),
            "in": hass.localize("ui.components.calendar.event.rrule.in")
        };

        // Get the list of occasions from config
        const occasions = this.config.occasions || [];
        const numberOfDays = this.config.numberofdays || 365;

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

        const occasionsToday = this.generateOccasionHtml(sortedOccasions.filter(occasion => occasion.diff === 0), true, translations);
        const upcomingOccasions = this.generateOccasionHtml(sortedOccasions.filter(occasion => occasion.diff > 0), false, translations);

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
                `<div class='bd-none'>${translations.nonot} ${translations.in} ${numberOfDays} ${translations.days}</div>`}
        `;
    }

    generateOccasionHtml(occasionList, isToday, translations) {
        return occasionList.map(occasion => `
            <div class='bd-wrapper ${isToday ? 'bd-today' : ''}'>
                <ha-icon class='ha-icon ${isToday ? 'on' : ''}' icon='${occasion.icon || (isToday ? "mdi:crown" : "mdi:calendar")}'></ha-icon>
                <div class='bd-name'>${occasion.name} ${occasion.count ? '(' + occasion.age + ' ' + translations.years + ')' : ''}</div>
                <div class='bd-when'>${isToday ? todayText : `${occasion.diff} ${translations.days}`}</div>
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

import { LitElement, html, css } from 'https://unpkg.com/lit@2.2.7/index.js?module';

class OccasionsCardEditor extends LitElement  {
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


customElements.define('occasions-card-editor', OccasionsCardEditor);
customElements.define('occasions-card', OccasionsCard);