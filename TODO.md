# TODO: Modify InquiryDetails to use getInquiries API and show property images

## Tasks
- [x] Modify fetchData in InquiryDetails.tsx to fetch all inquiries using inquiriesAPI.getInquiries(agent.id)
- [x] Filter the inquiries array to find the inquiry with id === parseInt(id)
- [x] If inquiry found, setInquiry and fetch property details using propertyId
- [x] If inquiry not found, set error message
- [x] Add display of property images in the Property Details section
- [ ] Test the changes to ensure individual inquiry displays correctly with property details and images
