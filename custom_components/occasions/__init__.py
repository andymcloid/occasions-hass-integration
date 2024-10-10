"""
    Occasions custom component - (c) Andreas Åhlfeldt
"""

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from .const import DOMAIN
import os
import shutil
import logging

_LOGGER = logging.getLogger(__name__)  # Set up logging

async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry):
    """Set up Occasions from a config entry."""
    ensure_frontend_files(hass)
    # Forward the setup to the sensor platform
    hass.async_create_task(
        hass.config_entries.async_forward_entry_setup(entry, "sensor")
    )
    return True


def ensure_frontend_files(hass):
    src = os.path.join(os.path.dirname(__file__), "occasions-card.js")
    dst_dir = os.path.join(hass.config.path("www/community/occasions-card/"))
    
    if not os.path.exists(dst_dir):
        os.makedirs(dst_dir)

    dst_file = os.path.join(dst_dir, "occasions-card.js")

    if not os.path.exists(dst_file):
        shutil.copyfile(src, dst_file)
        _LOGGER.info("Occasions frontend files copied to: %s", dst_dir)