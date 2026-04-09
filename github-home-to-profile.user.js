// ==UserScript==
// @name         GitHub Home → Profile
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Redirect the GitHub logo to your profile instead of the home feed
// @author       You
// @match        https://github.com/*
// @license      Unlicense
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    function patchIcon() {
        const username = document.querySelector('meta[name="user-login"]')?.content;
        if (!username) return;

        const anchor = document.querySelector('a svg.octicon-mark-github')?.closest('a');
        if (anchor && anchor.getAttribute('href') === '/') {
            anchor.setAttribute('href', '/' + username);
        }
    }

    patchIcon();

    // GitHub is a SPA — re-patch after navigation events reset the DOM
    const observer = new MutationObserver(patchIcon);
    observer.observe(document.documentElement, { childList: true, subtree: true });
})();
