# Legal Intake & Case Triage Application
*A workflow-driven, human-centered review system*

## Overview
This project is a full-stack web application originally built as an IT helpdesk system and intentionally designed to model **legal aid intake and case triage workflows**.

It focuses on structured information intake, review accountability, and clear decision pathways — principles shared by legal, judicial, and public-sector systems.

---

## Problem Context
Legal and public-interest organizations often face:
- High volumes of incoming requests
- Incomplete or inconsistent user-provided information
- The need for transparency, traceability, and human oversight

This application explores how thoughtful interface design and backend architecture can support **responsible, reviewable decision-making**.

---

## Core Features
- Structured intake forms for collecting user-reported issues
- Role-based access for reviewers and administrators
- Status tracking to support triage and escalation workflows
- Email notifications to support timely review and follow-up
- Persistent records to support accountability and auditability

---

## Human-in-the-Loop Workflow
The system is intentionally designed to:
- Capture information without making automated decisions
- Require human review before outcomes are assigned
- Preserve visibility into how each case progresses

This aligns with responsible approaches to legal AI and access to justice.

---

## Tech Stack
- **Frontend:** React, JavaScript
- **Backend:** Node.js, Express
- **Database:** PostgreSQL
- **Authentication:** JWT-based role management
- **Deployment:** Railway / Vercel

---

## Security Considerations
Before deploying to production:
1. Set strong environment variables (see `.env.example`)
2. Change all default credentials
3. Use a secure JWT secret (32+ characters)
4. Configure SMTP securely for notifications
5. Review database access controls

---

## Why This Matters
This project demonstrates how full-stack systems can:
- Support intake and triage in high-stakes environments
- Preserve human judgment and accountability
- Provide a foundation for trustworthy, explainable AI integration

---

## Future Enhancements
- Reasoning-layer fields for reviewer justification
- Configurable intake logic for different legal domains
- Integration with open-source legal AI platforms
