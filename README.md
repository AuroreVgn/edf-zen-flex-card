# ⚡ EDF Zen Flex Card

[![Version](https://img.shields.io/github/v/release/AuroreVgn/edf-zen-flex-card?display_name=tag&label=version)](https://github.com/AuroreVgn/edf-zen-flex-card/releases)
[![Home Assistant](https://img.shields.io/badge/Home%20Assistant-carte%20Lovelace-41BDF5?logo=homeassistant)](https://www.home-assistant.io/)
[![HACS](https://img.shields.io/badge/HACS-dépôt%20personnalisé-41BDF5)](https://www.hacs.xyz/)

Carte personnalisée **Lovelace** pour afficher les journées et tarifs de l'offre **EDF Zen Flex** dans Home Assistant.

> [!IMPORTANT]
> Cette carte nécessite l'[intégration EDF Zen Flex](https://github.com/AuroreVgn/edf-zen-flex). Projet communautaire non officiel, indépendant d'EDF.

## 🏠 Mes projets Home Assistant

[Découvrir mes projets Home Assistant](https://gentle-suggestion-7c3.notion.site/Mes-projets-Home-Assistant-3eda02eefa8f81a48621c3caeef7fa8e)

## ☕ Soutenir le projet

[Soutenir le développement sur Ko-fi](https://ko-fi.com/aurorevgn).

## ✨ Fonctionnalités

- Affichage des journées **aujourd'hui** et **demain** : Éco, Sobriété ou Bonus.
- Calendrier mensuel des journées connues, avec navigation entre les mois.
- Compteurs annuels et jours restants, selon les informations fournies par l'intégration.
- Prix actuel du kWh et période heures pleines/heures creuses.
- Tableau des tarifs Éco et Sobriété en HP/HC.
- Icônes adaptées aux types de journée et aux périodes tarifaires.
- Deux modes d'affichage : **complet** et **compact**.
- Éditeur visuel permettant de personnaliser le titre, l'entité et les options d'affichage.
- Détection automatique du capteur de journée lorsque l'entité n'est pas précisée.

## 📦 Installation

### Option A — HACS (recommandé)

#### Automatiquement

[![Ouvrir Home Assistant et ajouter ce dépôt dans HACS](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=AuroreVgn&repository=edf-zen-flex-card&category=plugin)

#### Manuellement

Cette carte étant distribuée depuis un dépôt personnalisé, il faut l'ajouter une première fois dans HACS :

1. Ouvrir **HACS** → **Tableau de bord**.
2. Ouvrir le menu **⋮** → **Dépôts personnalisés**.
3. Ajouter :

   ```text
   https://github.com/AuroreVgn/edf-zen-flex-card
   ```

4. Choisir la catégorie **Tableau de bord** (ou **Plugin**, selon la version de HACS).
5. Rechercher **EDF Zen Flex Card** puis installer la carte.
6. Actualiser le navigateur si nécessaire.

### Option B — Installation manuelle

1. Télécharger le fichier `dist/zen-flex-card.js` depuis ce dépôt.
2. Le copier dans :

   ```text
   /config/www/zen-flex-card.js
   ```

3. Ajouter une ressource JavaScript de type **Module JavaScript** dans **Paramètres → Tableaux de bord → Ressources** :

   ```text
   /local/zen-flex-card.js
   ```

4. Actualiser le tableau de bord.

Avec HACS, la ressource habituelle est `/hacsfiles/edf-zen-flex-card/zen-flex-card.js` ; vérifier qu'elle a bien été enregistrée automatiquement.

## ⚙️ Configuration de la carte

Ajouter une carte **Manuelle** dans le tableau de bord :

```yaml
type: custom:zen-flex-card
title: EDF Zen Flex
mode: full
show_tariffs: true
show_remaining: true
```

La carte peut rechercher automatiquement le capteur « Aujourd'hui » de l'intégration. Si nécessaire, préciser son identifiant :

```yaml
type: custom:zen-flex-card
entity: sensor.edf_zen_flex_aujourd_hui
mode: compact
```

> L'identifiant exact du capteur dépend de votre installation : sélectionnez l'entité réelle depuis les outils de développement Home Assistant.

### Options disponibles

| Option | Valeur | Description |
| --- | --- | --- |
| `type` | `custom:zen-flex-card` | Type de carte |
| `title` | Texte | Titre personnalisé |
| `entity` | Identifiant d'entité | Capteur Aujourd'hui ; facultatif si détection automatique |
| `mode` | `full` ou `compact` | Mode complet ou compact |
| `show_tariffs` | `true` / `false` | Affichage des tarifs |
| `show_remaining` | `true` / `false` | Affichage des jours restants |

## 📊 Origine des données

La carte exploite les états et attributs de l'intégration **EDF Zen Flex**, notamment l'historique des journées, les compteurs annuels et les tarifs enregistrés. Elle ne contacte pas directement EDF.

Les journées non connues sont affichées comme telles ; elles ne sont pas déduites ou inventées.

## 🤝 Signaler un problème

Ouvrir une [issue GitHub](https://github.com/AuroreVgn/edf-zen-flex-card/issues) en précisant la version de Home Assistant, le navigateur, la configuration YAML et les éventuelles erreurs de console.

## 📄 Licence

Cette carte est distribuée sous licence **MIT**. Consultez le fichier [LICENSE](LICENSE).

---

**EDF Zen Flex Card** est un projet indépendant destiné à la communauté Home Assistant.
