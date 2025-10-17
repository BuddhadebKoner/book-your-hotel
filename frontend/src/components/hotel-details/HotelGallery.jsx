import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay, Thumbs } from 'swiper/modules'
import { useState, useMemo } from 'react'
import { Building2, Image as ImageIcon } from 'lucide-react'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/thumbs'

export default function HotelGallery({ hotel, hotelImages }) {
   const [thumbsSwiper, setThumbsSwiper] = useState(null)
   const [imageError, setImageError] = useState({})

   const handleImageError = (index) => {
      setImageError(prev => ({ ...prev, [index]: true }))
   }

   if (hotelImages.length === 0) {
      return (
         <div className="rounded-xl overflow-hidden mb-4 shadow-2xl h-[500px] bg-gradient-to-br from-blue-500 via-purple-600 to-pink-600 flex items-center justify-center relative">
            <Building2 className="h-32 w-32 text-white/80 z-10" />
            <div className="absolute inset-0 bg-black/10" />
         </div>
      )
   }

   return (
      <div className="mb-8">
         <Swiper
            modules={[Navigation, Pagination, Autoplay, Thumbs]}
            navigation
            pagination={{ clickable: true }}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
            className="rounded-xl overflow-hidden mb-4 shadow-2xl"
            style={{ height: '500px' }}
         >
            {hotelImages.map((image, index) => (
               <SwiperSlide key={index}>
                  <div className="relative w-full h-full bg-slate-100 dark:bg-slate-800">
                     {!imageError[index] ? (
                        <img
                           src={image.urlHd || image.url}
                           alt={image.caption || `${hotel.name} - Image ${index + 1}`}
                           className="w-full h-full object-cover"
                           loading={index === 0 ? 'eager' : 'lazy'}
                           onError={() => handleImageError(index)}
                        />
                     ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                           <Building2 className="h-32 w-32 text-white/80" />
                        </div>
                     )}
                     {image.caption && (
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                           <p className="text-white text-sm capitalize">{image.caption}</p>
                        </div>
                     )}
                  </div>
               </SwiperSlide>
            ))}
         </Swiper>

         {/* Thumbnails */}
         {hotelImages.length > 1 && (
            <Swiper
               onSwiper={setThumbsSwiper}
               modules={[Thumbs]}
               spaceBetween={10}
               slidesPerView={6}
               watchSlidesProgress
               className="rounded-lg overflow-hidden"
               breakpoints={{
                  320: { slidesPerView: 3 },
                  640: { slidesPerView: 4 },
                  768: { slidesPerView: 5 },
                  1024: { slidesPerView: 6 },
               }}
            >
               {hotelImages.slice(0, 12).map((image, index) => (
                  <SwiperSlide key={index} className="cursor-pointer">
                     <div className="aspect-video rounded-md overflow-hidden border-2 border-transparent hover:border-primary transition-all">
                        {!imageError[`thumb-${index}`] ? (
                           <img
                              src={image.url}
                              alt={`Thumbnail ${index + 1}`}
                              className="w-full h-full object-cover"
                              onError={() => handleImageError(`thumb-${index}`)}
                           />
                        ) : (
                           <div className="w-full h-full bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center">
                              <ImageIcon className="h-6 w-6 text-slate-400" />
                           </div>
                        )}
                     </div>
                  </SwiperSlide>
               ))}
            </Swiper>
         )}
      </div>
   )
}
