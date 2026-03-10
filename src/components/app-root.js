/**
 * Copyright 2026 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import './view-landing.js';
import './view-splash.js';
import './view-missions.js';
import './view-chat.js';
import './view-summary.js';
import './view-session-summary.js';
import './view-demo.js';
import './view-creator.js';
import './view-lola.js';
import './split-screen.js';
import './view-educator.js';
import './view-dashboard.js';
import './text-cycler.js';

class AppRoot extends HTMLElement {
    constructor() {
        super();
        this.state = {
            view: 'landing', // landing, lola, split, splash, missions, chat, summary
            selectedMission: null,
            selectedLanguage: null,
            sessionResult: null
        };
    }

    connectedCallback() {
        this.innerHTML = '';

        // Restore saved theme preference
        const savedTheme = localStorage.getItem('lola_theme');
        if (savedTheme === 'light') document.body.classList.add('light-mode');
        else document.body.classList.remove('light-mode');

        // Persistent Header
        const header = document.createElement('header');
        header.style.cssText = `
            display: flex;
            justify-content: flex-end;
            align-items: center;
            padding: var(--spacing-sm) var(--spacing-md);
            gap: var(--spacing-md);
            width: 100%;
            pointer-events: none;
        `;

        header.innerHTML = `
            <div style="pointer-events: auto; display: flex; align-items: center; gap: var(--spacing-sm);">
                <a href="https://github.com/ORBWEVA/lola" target="_blank" style="
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    padding: 8px 16px;
                    border: 1px solid var(--lola-surface-3, #22224a);
                    border-radius: var(--radius-sm, 8px);
                    color: var(--lola-text-secondary, #9595b0);
                    text-decoration: none;
                    font-weight: 500;
                    font-size: 0.85rem;
                    transition: all 0.2s ease;
                    background: transparent;
                " onmouseover="this.style.borderColor='var(--lola-indigo, #4361ee)'; this.style.color='var(--lola-text, #f0f0f8)';" onmouseout="this.style.borderColor='var(--lola-surface-3, #22224a)'; this.style.color='var(--lola-text-secondary, #9595b0)';">
                    <svg height="16" viewBox="0 0 16 16" version="1.1" width="16" aria-hidden="true" style="fill: currentColor; opacity: 0.8;"><path fill-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path></svg>
                    Source
                </a>
            </div>
        `;

        this.appendChild(header);

        // View Container
        this.viewContainer = document.createElement('div');
        this.viewContainer.style.height = "100%";
        this.viewContainer.style.width = "100%";
        this.appendChild(this.viewContainer);

        this.render();

        this.checkConfigStatus();

        this.addEventListener('navigate', (e) => {
            this.state.view = e.detail.view;
            if (e.detail.mission) this.state.selectedMission = e.detail.mission;
            if (e.detail.language) this.state.selectedLanguage = e.detail.language;
            if (e.detail.fromLanguage) this.state.selectedFromLanguage = e.detail.fromLanguage;
            if (e.detail.mode) this.state.selectedMode = e.detail.mode;
            if (e.detail.result) this.state.sessionResult = e.detail.result;
            if (e.detail.profileData) this.state.profileData = e.detail.profileData;
            if (e.detail.sessionData) this.state.sessionData = e.detail.sessionData;
            if (e.detail.avatarConfig) this.state.avatarConfig = e.detail.avatarConfig;
            this.render();
        });
    }

    async checkConfigStatus() {
        try {
            const res = await fetch('/api/status');
            const data = await res.json();

            if (data.mode === 'simple') {
                this.showSimpleModeWarning(data.missing);
            }
        } catch (e) {
            console.warn("Failed to check config status:", e);
        }
    }

    showSimpleModeWarning(missing) {
        const warning = document.createElement('div');
        warning.style.cssText = `
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            background: rgba(255, 209, 102, 0.15);
            color: var(--lola-warning, #ffd166);
            padding: 8px 16px;
            text-align: center;
            font-size: 0.85rem;
            z-index: 9999;
            border-top: 1px solid rgba(255, 209, 102, 0.3);
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 8px;
            backdrop-filter: blur(12px);
        `;

        const missingText = missing.join(' & ');
        warning.innerHTML = `
            <span><b>Dev Mode:</b> ${missingText} not configured.</span>
            <a href="https://github.com/ORBWEVA/lola#environment-variables" target="_blank" style="color: var(--lola-sky, #4cc9f0); text-decoration: underline; font-weight: 600; margin-left: 4px;">Learn more</a>
        `;

        this.appendChild(warning);
    }

    render() {
        if (!this.viewContainer) return;

        this.viewContainer.innerHTML = '';
        let currentView;

        // Hide header on landing page (it has its own logo/menu)
        const header = this.querySelector('header');
        if (header) header.style.display = this.state.view === 'landing' ? 'none' : 'flex';

        switch (this.state.view) {
            case 'landing':
                currentView = document.createElement('view-landing');
                break;
            case 'splash':
                currentView = document.createElement('view-splash');
                break;
            case 'missions':
                currentView = document.createElement('view-missions');
                break;
            case 'chat':
                currentView = document.createElement('view-chat');
                currentView.mission = this.state.selectedMission;
                currentView.language = this.state.selectedLanguage;
                currentView.fromLanguage = this.state.selectedFromLanguage;
                currentView.mode = this.state.selectedMode;
                break;
            case 'lola':
                currentView = document.createElement('view-lola');
                currentView.skipSplash = true;
                if (this.state.avatarConfig) currentView.avatarConfig = this.state.avatarConfig;
                break;
            case 'creator':
                currentView = document.createElement('view-creator');
                break;
            case 'split':
                currentView = document.createElement('split-screen');
                break;
            case 'educator':
                currentView = document.createElement('view-educator');
                break;
            case 'dashboard':
                currentView = document.createElement('view-dashboard');
                currentView.profileData = this.state.profileData;
                currentView.sessionData = this.state.sessionData;
                break;
            case 'session-summary':
                currentView = document.createElement('view-session-summary');
                currentView.sessionData = this.state.sessionData;
                break;
            case 'demo':
                currentView = document.createElement('view-demo');
                break;
            case 'summary':
                currentView = document.createElement('view-summary');
                currentView.result = this.state.sessionResult;
                break;
            default:
                currentView = document.createElement('view-splash');
        }

        currentView.classList.add('fade-in');
        this.viewContainer.appendChild(currentView);
    }
}

customElements.define('app-root', AppRoot);
