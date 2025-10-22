# Add Latitude and Longitude to PropertyForm

## Tasks
- [x] Update PropertyDto and Property interfaces in src/types/agent.ts to include latitude and longitude as optional numbers
- [ ] Update PropertyForm.tsx to add latitude and longitude to formData state
- [ ] Add latitude and longitude input fields in Location Details card
- [ ] Add "Fetch Location" button with geolocation functionality
- [ ] Update handleInputChange to handle number inputs for lat/long
- [ ] Test geolocation and form submission

# Add Sold and Active Buttons to Property Details Page

## Tasks
- [x] Add updatePropertyStatus function to propertiesAPI in src/lib/api.ts
- [x] Add Sold and Active buttons to PropertyDetails.tsx near the Edit button
- [x] Implement button click handlers to update property status via API
- [x] Add loading states and error handling for status updates
- [x] Update property state after successful status change
- [x] Test status update functionality
