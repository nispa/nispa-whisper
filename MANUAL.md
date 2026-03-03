# User Manual - nispa-whisper

Welcome to **nispa-whisper**, the professional automatic transcription suite optimized for modular performance and AI integration.

## 📋 Table of Contents
1. [Introduction](#introduction)
2. [Interface Guide](#interface-guide)
3. [Interactive Waveform](#interactive-waveform)
4. [AI-Ready Export (MCP)](#ai-ready-export-mcp)
5. [Advanced Settings](#advanced-settings)
6. [Architecture for Developers](#architecture-for-developers)

---

## 1. Introduction
nispa-whisper leverages the **faster-whisper** engine to provide near-instant, high-precision transcription locally on your hardware. It ensures 100% privacy as no audio data ever leaves your machine.

## 2. Interface Guide

### Dashboard
The starting point for all your projects.
- **Project Grid**: View recent transcriptions with their model and language info.
- **Delete**: Hover over a card to remove a project and its cached data.

### Modular Editor
- **Left Panel (Player)**: Features synchronized video and real-time waveform.
- **Right Panel (Transcript)**: High-performance list with auto-scroll. Click any text to enter edit mode.
- **Toolbar**: Contains Undo/Redo history and bulk "Find & Replace" tools.

## 3. Interactive Waveform
The waveform is **real** (generated from actual audio data).
- **Navigation**: Click anywhere on the waveform bars to jump to that specific moment in the video.
- **Visual Feedback**: Peaks represent audio amplitude, helping you identify speech segments visually.

## 4. AI-Ready Export (MCP)
- **JSON (MCP)**: Specifically designed for LLMs (Large Language Models).
- **Usage**: Export/Copy as JSON (MCP) and paste into your favorite AI tool. It includes timestamps and metadata that help the AI understand the context better.

## 5. Advanced Settings
Managed via a dynamic configuration system:
- **Interface**: Switch between Italian and English.
- **AI Config**: Set up your API Keys for Gemini, OpenAI, or Anthropic to use advanced analysis on your transcripts.

## 6. Architecture for Developers
The app follows a modern modular pattern:
- **Frontend**: Components are split into functional directories (`Editor`, `Dashboard`, etc.) using React Context for state.
- **Backend**: Flask is organized via **Blueprints** and a **Service Layer**, making it easy to add new API endpoints or transcription engines.

---

# Manuale Utente - nispa-whisper (Italiano)

## 📋 Indice
1. [Introduzione](#introduzione-it)
2. [Guida all'Interfaccia](#guida-interfaccia-it)
3. [Waveform Interattiva](#waveform-interattiva-it)
4. [Esportazione IA (MCP)](#esportazione-ia-mcp-it)
5. [Impostazioni Avanzate](#impostazioni-avanzate-it)

---

## 1. Introduzione {#introduzione-it}
nispa-whisper utilizza il motore **faster-whisper** per fornire trascrizioni ad alta precisione direttamente sul tuo hardware, garantendo la totale privacy dei tuoi dati.

## 2. Guida all'Interfaccia {#guida-interfaccia-it}

### Dashboard
- **Griglia Progetti**: Visualizza le trascrizioni recenti.
- **Eliminazione**: Passa il mouse su una card per eliminare il progetto.

### Editor Modulare
- **Player (Sinistra)**: Video sincronizzato e waveform reale.
- **Trascrizione (Destra)**: Clicca su un testo per modificarlo. Il video si sposterà automaticamente all'inizio di quel segmento.
- **Toolbar**: Include cronologia Annulla/Ripristina e "Trova e Sostituisci".

## 3. Waveform Interattiva {#waveform-interattiva-it}
La forma d'onda è reale e cliccabile.
- **Navigazione**: Clicca sulle barre della waveform per spostare istantaneamente il video a quel punto.
- **Precisione**: I picchi aiutano a individuare visivamente dove inizia e finisce il parlato.

## 4. Esportazione IA (MCP) {#esportazione-ia-mcp-it}
- **JSON (MCP)**: Formato ottimizzato per i modelli linguistici (Gemini, ChatGPT, Claude).
- **Utilizzo**: Copia il contenuto e incollalo nell'IA chiedendo riassunti o analisi strutturate.

## 5. Impostazioni Avanzate {#impostazioni-avanzate-it}
- **Configurazione AI**: Inserisci le tue API Key per abilitare analisi intelligenti direttamente nell'app.
- **Dinamismo**: Il sistema di impostazioni è dinamico e facile da espandere.
