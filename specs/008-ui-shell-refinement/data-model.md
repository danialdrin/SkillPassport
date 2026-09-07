# Data Model: UI Shell Refinement

This feature does not introduce persistent domain data or change backend contracts. The relevant design entities are transient UI state and existing route metadata.

## Navigation Destination

Represents a menu destination exposed by the shared top bar.

| Field      | Type                    | Rules                                                              |
| ---------- | ----------------------- | ------------------------------------------------------------------ |
| `label`    | display text            | Must be `Skill Gap` or `Digital Passport` for this feature         |
| `path`     | route path              | Must preserve `/skill-graph` or `/passport`                        |
| `icon`     | existing icon reference | Must follow current icon style and provide a meaningful visual cue |
| `isActive` | derived boolean         | True when the current location matches the destination route       |

**Validation rules**:

- Find & Ingest must not be present in the destination collection.
- Overview must not be present in the destination collection.
- Destination links must remain keyboard reachable and activate their existing routes.

## Menu State

Transient state for the shared interactive menu.

| Field          | Type             | Rules                                                                                   |
| -------------- | ---------------- | --------------------------------------------------------------------------------------- |
| `open`         | boolean          | Defaults to false; toggles from the Menu control                                        |
| `dismissible`  | boolean behavior | Escape, selecting a destination, and the menu control can close it                      |
| `availableFor` | auth status      | Authenticated users see the destination menu; public users retain existing auth actions |

**State transitions**:

- Closed -> Open when an authenticated user activates Menu.
- Open -> Closed when Menu is activated again, a destination is selected, or the menu is dismissed.
- Any state -> Closed after logout or navigation completion.

## Shared Shell Layout

The shell's responsive presentation, not persisted data.

| Region       | Requirement                                                                          |
| ------------ | ------------------------------------------------------------------------------------ |
| Top bar      | Menu, Logo, Search, Profile in order where authenticated controls apply              |
| Main content | Wider shared container with stable responsive side padding and local readable widths |
| Footer       | Absent from the global shell                                                         |

## Relationships

- `Menu State` controls visibility of the `Navigation Destination` collection.
- `Navigation Destination` uses existing application routes and does not own route definitions.
- `Shared Shell Layout` wraps existing pages and must not alter page-specific domain data.
