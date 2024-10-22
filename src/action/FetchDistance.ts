"use server"
export default async function FetchDistances (formdata: FormData) {
        const userlatitude= formdata.get("userlatitude");
        const userlongtitude= formdata.get("userlongtitude");
        const hotelatitude= formdata.get("hotelatitude");
        const hotellongtitude= formdata.get("hotellongtitude");
      try 
      {
            const response = await fetch(
              `https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=${userlatitude},${userlongtitude}&destinations=${hotelatitude},${hotellongtitude}&mode=driving&key=${process.env.NEXT_PUBLIC_MATRIX_KEY}`
            );
       
            if(response.ok)
            {
                const data= await response.json()
                console.log(data)

                return {success: true ,distance:data?.rows[0]?.elements[0]?.distance?.text  }
             
            }
            else{
                return {success: false, message: "Fail to Fetch"}
            }
        } catch (err) {
            if(err instanceof Error)
          return {success: false , message: err.message}
        return;
        }
      }