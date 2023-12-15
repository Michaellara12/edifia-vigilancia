import { Skeleton, Box } from "@mui/material"

function FilesManagerLoading() {
  return (
    <Box
        display="grid"
        gridTemplateColumns={{
            xs: 'repeat(1, 1fr)',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
            lg: 'repeat(4, 1fr)',
        }}
        gap={3}
    >
        <Skeleton height={180} sx={{my: -3}}/>
        <Skeleton height={180} sx={{my: -3}}/>
        <Skeleton height={180} sx={{my: -3}}/>
        <Skeleton height={180} sx={{my: -3}}/>


    </Box>
  )
}

export default FilesManagerLoading