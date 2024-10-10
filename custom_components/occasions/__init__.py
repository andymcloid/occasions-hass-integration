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
    await register_lovelace_module(hass)
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


async def register_lovelace_module(hass):
    # Get the lovelace resources
    lovelace = hass.data.get("lovelace", None)
    
    # Fetch resources if not already fetched
    if lovelace and "resources" in lovelace:
        resources = lovelace["resources"].async_items()
    else:
        _LOGGER.error("Could not fetch Lovelace resources")
        return

    resource_url = "/hacsfiles/occasions-card/occasions-card.js"
    
    # Check if the resource is already added
    if not any(resource["url"] == resource_url for resource in resources):
        await hass.services.async_call(
            "lovelace", "resources/add", {
                "url": resource_url,
                "res_type": "module"
            }
        )
        _LOGGER.info(f"Added {resource_url} to Lovelace resources.")
    else:
        _LOGGER.info(f"Lovelace resource {resource_url} already exists.")
