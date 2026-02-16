# Base64 Image Storage Migration

## Overview
Updated the application to store images as Base64-encoded strings in MongoDB instead of using file system storage. This makes deployment easier and eliminates the need for persistent file storage.

## Changes Made

### Backend Controllers

1. **controllers/investorController.js**
   - Updated `uploadPhoto()` to accept Base64 image data via JSON
   - Added validation for Base64 format
   - Removed file upload handling

2. **controllers/ownerController.js**
   - Updated `uploadPhoto()` to accept Base64 image data via JSON
   - Added validation for Base64 format
   - Removed file upload handling

3. **controllers/campaignController.js**
   - Updated `createCampaign()` to accept `imageData` parameter
   - Added Base64 validation for campaign images
   - Stores image directly in `imageUrl` field

### Routes

1. **routes/investorRoutes.js**
   - Removed multer middleware
   - Removed multer configuration
   - Updated upload-photo route to handle JSON

2. **routes/ownerRoutes.js**
   - Removed multer middleware
   - Removed multer configuration
   - Updated upload-photo route to handle JSON

### Frontend Views

1. **views/investor-profile.ejs**
   - Updated photo upload to convert files to Base64
   - Added file size validation (max 5MB)
   - Added file type validation
   - Uses FileReader API to convert images

2. **views/owner-profile.ejs**
   - Updated photo upload to convert files to Base64
   - Added file size validation (max 5MB)
   - Added file type validation
   - Uses FileReader API to convert images

3. **views/owner-create-campaign.ejs**
   - Added campaign image upload field
   - Converts images to Base64 before submission
   - Added image preview functionality
   - Includes validation for size and type

## Database Schema

No changes needed to the database schema. The existing `String` fields for images now store Base64 data:
- `Campaign.imageUrl` - stores Base64 image data
- `Investor.profilePhoto` - stores Base64 image data
- `StartupOwner.profilePhoto` - stores Base64 image data

## Benefits

1. **Deployment Friendly**: No need for persistent file storage or volume mounting
2. **Simplified Architecture**: No file system management required
3. **Database Portability**: All data in one place (MongoDB)
4. **Easy Backup**: Images included in database backups

## Limitations

1. **Size Limit**: 5MB per image (enforced in frontend)
2. **Database Size**: Base64 encoding increases size by ~33%
3. **Performance**: Large images may impact query performance

## Testing Checklist

- [ ] Upload profile photo as investor
- [ ] Upload profile photo as startup owner
- [ ] Create campaign with image
- [ ] Verify images display correctly
- [ ] Test with different image formats (JPG, PNG, GIF)
- [ ] Test file size validation
- [ ] Test file type validation

## Migration Notes

Existing file-based images will need to be converted to Base64 if you have existing data. New uploads will automatically use Base64 format.
