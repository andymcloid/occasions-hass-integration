class OccasionsCard extends HTMLElement {
    set hass(hass) {
        if (!this.content) {
            const card = document.createElement('ha-card');
            card.header = this.config.title || 'Occasions';
            this.content = document.createElement('div');
            card.appendChild(this.content);
            this.appendChild(card);
        }

        // Get the list of occasions from config
        const occasions = this.config.occasions || [];
        

        this.content.innerHTML = `
            <ul style="list-style-type: none; padding: 0;">
                ${occasions.map(occasion => `
                    <li style="display: flex; justify-content: space-between; padding: 8px 0;">
                        <span><ha-icon icon="${occasion.icon || 'mdi:calendar'}"></ha-icon> ${occasion.name}</span>
                        <span>${occasion.date}</span>
                    </li>
                `).join('')}
            </ul>
        `;
    }

    setConfig(config) {
        this.config = config;
    }

    static getConfigElement() {
        return document.createElement("occasions-card-editor");
    }

    getCardSize() {
        return 1;
    }
}

customElements.define('occasions-card', OccasionsCard);
