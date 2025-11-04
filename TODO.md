# Draft Property Implementation

## Tasks
- [ ] Add draft saving logic to PropertyForm.tsx
- [ ] Add draft loading on form mount for new properties
- [ ] Clear draft on successful property creation
- [ ] Update Properties.tsx to display drafts from localStorage
- [ ] Add "DRAFT" filter option in properties page
- [ ] Add UI indicators for draft properties
- [ ] Handle navigation to edit drafts
- [ ] Test draft save/load functionality

## Implementation Details
- Drafts stored in localStorage with key `property-draft-${agentId}`
- Only save drafts for new properties (not edit mode)
- Exclude images from draft data (can't store File objects in localStorage)
- Auto-save draft on form changes with debounce
- Clear draft when property is successfully published
- Display drafts in properties list with "DRAFT" badge
- Allow editing drafts by populating form with draft data
