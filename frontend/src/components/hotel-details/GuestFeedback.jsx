import { useState } from 'react'
import { CheckCircle2, ChevronDown, ChevronUp, Star, Sparkles, AlertCircle } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Separator } from '../ui/separator'

export default function GuestFeedback({ sentimentAnalysis }) {
   const [showNegativeReviews, setShowNegativeReviews] = useState(false)

   if (!sentimentAnalysis || (!sentimentAnalysis.pros?.length && !sentimentAnalysis.cons?.length)) {
      return null
   }

   const hasPositiveReviews = sentimentAnalysis.pros && sentimentAnalysis.pros.length > 0
   const hasNegativeReviews = sentimentAnalysis.cons && sentimentAnalysis.cons.length > 0

   return (
      <Card className="w-full overflow-hidden">
         {/* Premium Header with Gradient */}
         <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-background border-b">
            <CardHeader className="pb-6">
               <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex-1">
                     <CardTitle className="flex items-center gap-3 text-2xl mb-2">
                        <div className="p-2 rounded-lg bg-primary/10">
                           <Star className="h-6 w-6 text-primary fill-primary" />
                        </div>
                        Guest Experiences
                     </CardTitle>
                     <CardDescription className="text-base">
                        Authentic feedback from verified guests who stayed at this property
                     </CardDescription>
                  </div>
                  {hasPositiveReviews && (
                     <Badge variant="secondary" className="px-4 py-2 text-base font-semibold">
                        <Sparkles className="h-4 w-4 mr-2" />
                        {sentimentAnalysis.pros.length} Highlights
                     </Badge>
                  )}
               </div>
            </CardHeader>
         </div>

         <CardContent className="pt-6 space-y-8">
            {/* Positive Reviews Section - Premium Display */}
            {hasPositiveReviews && (
               <div className="space-y-6">
                  <div className="flex items-center gap-3">
                     <div className="h-1 w-12 rounded-full bg-gradient-to-r from-green-500 to-emerald-500" />
                     <h3 className="text-xl font-bold text-foreground">
                        What Our Guests Love Most
                     </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     {sentimentAnalysis.pros.map((pro, index) => (
                        <div
                           key={index}
                           className="group relative overflow-hidden rounded-xl border border-green-200 dark:border-green-900/50 bg-gradient-to-br from-green-50 via-emerald-50/50 to-green-50 dark:from-green-950/30 dark:via-emerald-950/20 dark:to-green-950/30 p-5 hover:border-green-300 dark:hover:border-green-800 transition-all duration-300"
                        >
                           {/* Decorative gradient overlay */}
                           <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                           <div className="relative flex items-start gap-4">
                              <div className="flex-shrink-0 mt-0.5">
                                 <div className="p-2 rounded-full bg-green-500">
                                    <CheckCircle2 className="h-5 w-5 text-white" />
                                 </div>
                              </div>
                              <div className="flex-1 space-y-2">
                                 <p className="text-base font-medium text-foreground leading-relaxed">
                                    {pro}
                                 </p>
                                 <div className="flex items-center gap-1">
                                    {[...Array(5)].map((_, i) => (
                                       <Star key={i} className="h-3 w-3 fill-green-500 text-green-500" />
                                    ))}
                                 </div>
                              </div>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            )}

            {/* Divider between positive and negative */}
            {hasPositiveReviews && hasNegativeReviews && (
               <Separator className="my-8" />
            )}

            {/* Negative Reviews Section - Collapsible & Professional */}
            {hasNegativeReviews && (
               <div className="space-y-4">
                  <div className="flex items-center justify-between gap-4 p-4 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800">
                     <div className="flex items-center gap-3 flex-1">
                        <AlertCircle className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                        <div>
                           <h4 className="font-semibold text-foreground">
                              Guest Feedback for Improvement
                           </h4>
                           <p className="text-sm text-muted-foreground">
                              We value transparency and continuously work to enhance guest experiences
                           </p>
                        </div>
                     </div>
                     <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowNegativeReviews(!showNegativeReviews)}
                        className="flex-shrink-0 hover:bg-primary hover:text-white transition-colors"
                     >
                        {showNegativeReviews ? (
                           <>
                              <ChevronUp className="h-4 w-4 mr-2" />
                              Hide Details
                           </>
                        ) : (
                           <>
                              <ChevronDown className="h-4 w-4 mr-2" />
                              View {sentimentAnalysis.cons.length} Review{sentimentAnalysis.cons.length > 1 ? 's' : ''}
                           </>
                        )}
                     </Button>
                  </div>

                  {/* Collapsible Negative Reviews */}
                  {showNegativeReviews && (
                     <div className="space-y-3 animate-in slide-in-from-top-4 duration-300">
                        {sentimentAnalysis.cons.map((con, index) => (
                           <div
                              key={index}
                              className="flex items-start gap-3 p-4 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
                           >
                              <div className="h-2 w-2 rounded-full bg-amber-500 flex-shrink-0 mt-2" />
                              <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                                 {con}
                              </p>
                           </div>
                        ))}

                        {/* Professional Note */}
                        <div className="mt-4 p-4 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border border-blue-200 dark:border-blue-900">
                           <p className="text-sm text-blue-900 dark:text-blue-200 leading-relaxed">
                              <span className="font-semibold">Management Response:</span> We appreciate all guest feedback and are committed to addressing these concerns to provide an exceptional experience for all our guests.
                           </p>
                        </div>
                     </div>
                  )}
               </div>
            )}
         </CardContent>
      </Card>
   )
}
