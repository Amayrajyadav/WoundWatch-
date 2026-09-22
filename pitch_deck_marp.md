---
marp: true
theme: default
class: invert
size: 16:9
style: |
  h1 { color: #60a5fa; font-size: 2.5em; }
  h2 { color: #93c5fd; }
  li { font-size: 1.2em; line-height: 1.5; }
  strong { color: #f8fafc; }
---

# WoundWatch
## Recovery Intelligence Platform

*Understanding how wounds heal — privately, on your device.*

---

## 🛑 The Problem: Apps store data, they don't understand it.

Wound care tracking today is just a digital photo diary.

- **No Intelligence:** Patients stare at 10 slightly different photos guessing if they are healing.
- **No Context:** Pain and symptoms are tracked in a vacuum, detached from visual progress.
- **Cloud Dependent:** Highly sensitive medical images are uploaded to remote servers.

---

## ✨ The Solution: A Recovery Intelligence Platform

We built an engine that turns repeated wound observations into a longitudinal healing trajectory.

- **4D Normalization:** We map Pain, Visual Signal, Observable Area, and Symptoms onto a unified 0–100 scale.
- **Recovery Fingerprint:** Instant visual comparison of today's scan against your previous baseline.
- **100% On-Device:** Zero backend. Zero uploads. Complete privacy.

---

## 🧠 The Intelligence Engine

*Mathematical evidence, not just alerts.*

Our `ObservationEngine` runs entirely in the browser using the Canvas API and multivariate analysis.

- **Visual Signal Extraction:** Extracts red-channel color dominance directly from the pixel data.
- **Multivariate Anomaly Detection:** Flags deviations using Euclidean distance (σ) across all 4 tracked dimensions.
- **Change-Point Detection:** Monitors derivative spikes to catch sudden trajectory breakdowns.

---

## 🚀 The Impact & Next Steps

**Built for hackers. Designed for humans.**

WoundWatch proves that sophisticated, deeply personalized health intelligence doesn't require compromising privacy or relying on generic cloud LLMs.

**What's Next?**
- Caregiver Sharing (via on-device encrypted QR codes)
- Wound boundary contour detection
- Multi-wound tracking

**[github.com/Amayrajyadav/WoundWatch-](https://github.com/Amayrajyadav/WoundWatch-)**
