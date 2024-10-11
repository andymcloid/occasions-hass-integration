class OccasionsCard extends HTMLElement {
    set hass(hass) {
        if (!this.content) {
            const card = document.createElement('ha-card');
            card.header = this.config.title || 'Högtider';
            this.content = document.createElement('div');
            card.appendChild(this.content);
            this.appendChild(card);
        }

        // Gather entities that start with 'sensor.occasion_' and have required attributes
        const entities = Object.keys(hass.states)
            .filter(key => key.startsWith('sensor.occasion_'))
            .map(key => hass.states[key])
            .filter(entity => entity.attributes.remaining_days !== undefined);

        // Sort entities by the remaining_days attribute
        entities.sort((a, b) => a.attributes.remaining_days - b.attributes.remaining_days);

        // Format the content
        this.content.innerHTML = `
            <ul style="list-style-type: none; padding: 0;">
                ${entities.map(entity => `
                    <li style="display: flex; justify-content: space-between; padding: 8px 0;">
                        <span>${entity.attributes.icon ? `<ha-icon icon="${entity.attributes.icon}"></ha-icon>` : ''} ${entity.attributes.friendly_name}</span>
                        <span>${entity.attributes.remaining_days} dagar</span>
                    </li>
                `).join('')}
            </ul>
        `;
    }

    setConfig(config) {
        if (!config) {
            throw new Error('Invalid configuration');
        }
        this.config = config;
    }

    getCardSize() {
        return 1;
    }
}

customElements.define('occasions-card', OccasionsCard);
