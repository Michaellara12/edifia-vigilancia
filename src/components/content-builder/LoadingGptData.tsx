import { Skeleton, Box } from "@mui/material"

// <---------------------------------------------------------------------> //

export default function LoadingGptData() {
    return (
      <Box
        sx={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
        }}
      >
        <Box
            sx={{
                alignSelf: 'center',
                width: {lg: '60%', xs: '90%' }
            }}
        >
            <Skeleton height={120}/>
            <Skeleton height={120}/>
            <Skeleton height={120}/>
        </Box>
      </Box>
    )
  }