# User Manual - nispa-whisper

Welcome to **nispa-whisper**, the professional application for automatic transcription optimized for speed and Artificial Intelligence integration.

## 📋 Table of Contents
1. [Introduction](#introduction)
2. [Installation](#installation)
3. [Interface Guide](#interface-guide)
4. [Workflow](#workflow)
5. [Export and Formats](#export-and-formats)
6. [AI Integration (MCP)](#ai-integration-mcp)
7. [Troubleshooting](#troubleshooting)

---

## 1. Introduction
nispa-whisper uses OpenAI's **Whisper** model (via the `faster-whisper` implementation) to convert audio and video files into text with extremely high accuracy. It is designed to run locally, ensuring maximum data privacy.

## 2. Installation
Ensure you have installed:
- **Python 3.10+**
- **FFmpeg** (essential for audio processing)
- **Node.js** (for the web interface)

Run `install_env.bat` to automatically configure the environment.

## 3. Interface Guide

### Dashboard
The main screen shows the list of your projects.
- **New Project**: Click to upload a file.
- **Status**: Monitor transcription progress in real-time.
- **Actions**: You can open the editor or delete projects no longer needed.

### Transcription Editor
The editor is divided into two parts:
- **Left (Player)**: Displays the video or audio. You can navigate by clicking on the waveform.
- **Right (Text)**: Shows the transcribed segments. Click on a text to edit it.
- **Shortcuts**: Use `Tab` to start/pause playback.

## 4. Workflow
1. **Upload**: Drag a file into the upload area.
2. **Configuration**: Choose the model size (e.g., `medium` for a good balance, `large-v3` for maximum precision).
3. **Transcription**: Wait for completion. If you have an NVIDIA GPU, the process will be much faster.
4. **Review**: Correct any errors in the editor. Use the "Find and Replace" function for bulk corrections.

## 5. Export and Formats
We support several formats:
- **SRT/VTT**: Standard for subtitles.
- **TXT**: Plain text for documents.
- **CSV**: For analysis in Excel/spreadsheets.
- **JSON (MCP)**: AI-optimized format.

## 6. AI Integration (MCP)
The **JSON (MCP)** format is nispa-whisper's flagship feature for those working with AI.
- Select `JSON (MCP)` from the dropdown menu in the editor.
- Click **COPY**.
- Paste the content into **Gemini**, **ChatGPT**, or **Claude**.
- **Recommended Prompt**: *"Use this transcription to generate a structured summary and a detailed handout of the key points."*

## 7. Troubleshooting
- **Media Unavailable Error**: If you move or rename the original file on disk, the app might not find it. Use the "Reupload Original File" button in the editor to reconnect it.
- **Slowness**: Ensure CUDA drivers are up to date if using an NVIDIA GPU. Check system status in Settings.

---

# Manuale Utente - nispa-whisper (Italiano)

Benvenuto in **nispa-whisper**, l'applicazione professionale per la trascrizione automatica ottimizzata per la velocità e l'integrazione con l'Intelligenza Artificiale.

## 📋 Indice
1. [Introduzione](#introduzione)
2. [Installazione](#installazione)
3. [Guida all'Interfaccia](#guida-allinterfaccia)
4. [Flusso di Lavoro](#flusso-di-lavoro)
5. [Esportazione e Formati](#esportazione-e-formati)
6. [Integrazione IA (MCP)](#integrazione-ia-mcp)
7. [Risoluzione dei Problemi](#risoluzione-dei-problemi)

---

## 1. Introduzione
nispa-whisper utilizza il modello **Whisper** di OpenAI (tramite l'implementazione `faster-whisper`) per convertire file audio e video in testo con un'accuratezza elevatissima. È progettato per funzionare localmente, garantendo la massima privacy dei tuoi dati.

## 2. Installazione
Assicurati di avere installato:
- **Python 3.10+**
- **FFmpeg** (fondamentale per l'elaborazione audio)
- **Node.js** (per l'interfaccia web)

Esegui `install_env.bat` per configurare automaticamente l'ambiente.

## 3. Guida all'Interfaccia

### Dashboard
La schermata principale mostra l'elenco dei tuoi progetti.
- **Nuovo Progetto**: Clicca per caricare un file.
- **Stato**: Monitora il progresso della trascrizione in tempo reale.
- **Azioni**: Puoi aprire l'editor o eliminare i progetti non più necessari.

### Editor di Trascrizione
L'editor è diviso in due parti:
- **Sinistra (Player)**: Visualizza il video o l'audio. Puoi navigare cliccando sulla forma d'onda.
- **Destra (Testo)**: Mostra i segmenti trascritti. Clicca su un testo per modificarlo.
- **Scorciatoie**: Usa `Tab` per avviare/mettere in pausa la riproduzione.

## 4. Flusso di Lavoro
1. **Caricamento**: Trascina un file nell'area di upload.
2. **Configurazione**: Scegli la dimensione del modello (es. `medium` per un buon equilibrio, `large-v3` per la massima precisione).
3. **Trascrizione**: Attendi il completamento. Se hai una GPU NVIDIA, il processo sarà molto più veloce.
4. **Revisione**: Correggi eventuali errori nell'editor. Usa la funzione "Trova e Sostituisci" per correzioni di massa.

## 5. Esportazione e Formati
Supportiamo diversi formati:
- **SRT/VTT**: Standard per i sottotitoli.
- **TXT**: Testo semplice per documenti.
- **CSV**: Per analisi in Excel/fogli di calcolo.
- **JSON (MCP)**: Formato ottimizzato per l'IA.

## 6. Integrazione IA (MCP)
Il formato **JSON (MCP)** è la punta di diamante di nispa-whisper per chi lavora con l'IA.
- Seleziona `JSON (MCP)` nel menu a tendina dell'editor.
- Clicca su **COPIA**.
- Incolla il contenuto in **Gemini**, **ChatGPT** o **Claude**.
- **Prompt consigliato**: *"Usa questa trascrizione per generare un riassunto strutturato e una dispensa dettagliata dei punti chiave."*

## 7. Risoluzione dei Problemi
- **Errore Media non disponibile**: Se sposti o rinomini il file originale sul disco, l'app potrebbe non trovarlo. Usa il pulsante "Ricarica File Originale" nell'editor per ricollegarlo.
- **Lentezza**: Assicurati che i driver CUDA siano aggiornati se usi una GPU NVIDIA. Controlla lo stato del sistema nelle Impostazioni.
