export  function transformCloudinaryUrl(url: string, width: number, height: number): string {
  // Split the URL into parts before and after the 'upload/' part
  const parts = url.split('/upload/');
  
  // Insert the transformation parameters (width, height, and cropping mode)
  const transformation = `w_${width},h_${height},c_fill`;

  // Rebuild and return the transformed URL
  return `${parts[0]}/upload/${transformation}/${parts[1]}`;
}
