const platformMediaConfig = {
  SNAPCHAT: {
    acceptedImageTypes: ['image/png', 'image/jpg', 'image/jpeg'].join(', '),
    acceptedVideoTypes: ['video/mp4', 'video/quicktime', 'video/mov'].join(', '),
    maxImageSize: 5000000,
    maxVideoSize: 1000000000,
    maxVideoDuration: 180,
    minVideoDuration: 3,
    acceptedVideoAspectRatio: ['9:16'],
    acceptedImageWidth: 1080,
    acceptedImageHeight: 1920,
  },
  TIKTOK: {
    acceptedVideoTypes: ['video/mp4', 'video/mov', 'video/mpeg', 'video/3gp', 'video/avi'].join(', '),
    maxVideoSize: 500000000,
    maxVideoDuration: 60,
    minVideoDuration: 5,
    acceptedVideoAspectRatio: ['9:16', '16:9', '1:1'],
  },
  META: {
    acceptedImageTypes: ['image/png', 'image/jpg'].join(', '),
    acceptedVideoTypes: ['video/mp4', 'video/quicktime'].join(', '),
    maxImageSize: 30000000,
    maxVideoSize: 1000000000,
    maxVideoDuration: 1200,
    minVideoDuration: 1,
    acceptedVideoAspectRatio: ['1:1'],
    acceptedImageAspectRatio: ['1:1', '1.91:1'],
    minImageWidth: 1080,
    minImageHeight: 1080,
  },
  TWITTER: {
    acceptedImageTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/bmp'].join(', '),
    acceptedVideoTypes: ['video/mp4'].join(', '),
    maxImageSize: 3000000,
    maxVideoSize: 512000000,
    maxVideoDuration: 180,
    minVideoDuration: 3,
    acceptedImageAspectRatio: ['1:1', '1.91:1'],
    acceptedVideoAspectRatio: ['16:9', '1:1'],
    minImageWidth: 800,
  },
}

export default platformMediaConfig