// ==UserScript==
// @name         GitHub Home → Profile
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Redirect the GitHub logo: cycle between Home / Profile / Repositories via the Tampermonkey menu
// @author       AIPEAC
// @match        https://github.com/*
// @license      Unlicense
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// ==/UserScript==

(function () {
    'use strict';

    const MODES = [
        { label: '🏠 Home',          href: username => '/' },
        { label: '👤 Profile',       href: username => '/' + username },
        { label: '📁 Repositories',  href: username => '/' + username + '?tab=repositories' },
    ];

    let currentMode = GM_getValue('logoMode', 1); // default: Profile

    function getUsername() {
        return document.querySelector('meta[name="user-login"]')?.content;
    }

    function patchIcon() {
        const username = getUsername();
        if (!username) return;

        const anchor = document.querySelector('a svg.octicon-mark-github')?.closest('a');
        if (!anchor) return;

        anchor.setAttribute('href', MODES[currentMode].href(username));
    }

    function cycleMode() {
        currentMode = (currentMode + 1) % MODES.length;
        GM_setValue('logoMode', currentMode);
        patchIcon();
        updateMenu();
    }

    function updateMenu() {
        const next = MODES[(currentMode + 1) % MODES.length].label;
        GM_registerMenuCommand('GitHub logo → ' + MODES[currentMode].label + '  |  click to switch to: ' + next, cycleMode);
    }

    patchIcon();
    updateMenu();

    // GitHub is a SPA — re-patch after navigation events reset the DOM
    const observer = new MutationObserver(patchIcon);
    observer.observe(document.documentElement, { childList: true, subtree: true });
})();
