# Global Insights Design System (Stitch Aligned)

This document outlines the design principles and implementation rules for the "Global Insights" dashboard, aligned with the Stitch design system.

## Core Philosophies

### 1. Neumorphism & Claymorphism
We employ Neumorphism for static containers and Claymorphism for interactive elements, integrated with the Stitch color palette.

## Color Palette (Stitch)

- **Primary Color**: `#70A1FF` - Bright, friendly blue for CTAs and highlights.
- **Secondary Color**: `#FFB347` - Warm orange for secondary actions and status.
- **Tertiary Color**: `#FFCCBC` - Soft peach for accents and badges.
- **Neutral/Surface**: `#F5F5F7` - Light grey base for all UI surfaces.

## Typography

- **Headlines**: `Plus Jakarta Sans` - Bold, modern headers.
- **Body & Labels**: `Manrope` - Clean, highly readable text.

## Shape and Form

- **Roundedness**: Maximum (Pill-shaped).
- **Cards**: `3.5rem` to `4rem` border-radius for a soft, friendly look.
- **Buttons/Badges**: `rounded-full` (9999px) for a complete pill shape.

## Implementation Guidelines

| Component | Style | implementation Note |
| :--- | :--- | :--- |
| **Sidebar** | Neumorphic Flat | `#F5F5F7` background with subtle soft shadows. |
| **Topbar** | Glass-Clay | Glassmorphism + Claymorphic depth. |
| **Action Buttons** | Claymorphic Pill | Full rounded corners (`rounded-full`) and tactile feel. |
| **Cards** | Mixed | Neumorphic flat or Claymorphic depending on hierarchy. |

