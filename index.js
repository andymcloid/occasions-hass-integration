/*
     █████   █████  ██████  ██████ █████ █████  █████  █     █ █████   █████  ██████ █████  ██████
    █     █ █     █ █     █ █    █ █       █   █     █ ███   █ █      █     █ █    █ █    █ █     █
    █     █ █       █       ██████ █████   █   █     █ █ ██  █ █████  █       ██████ █████  █     █
    █     █ █     █ █     █ █    █     █   █   █     █ █  ██ █     █  █     █ █    █ █   █  █     █
     █████   █████  ██████  █    █ █████ █████  █████  █    ██ █████   █████  █    █ █    █ ██████
     Copyright AndyMcLoid (c) 2024
*/

import { OccasionsCard } from './OccasionsCard.js';
import { OccasionsCardEditor } from './OccasionsCardEditor.js';
customElements.define('occasions-card-editor', OccasionsCardEditor);
customElements.define('occasions-card', OccasionsCard);