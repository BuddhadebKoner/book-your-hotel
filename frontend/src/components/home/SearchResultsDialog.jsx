import { useState, useEffect } from 'react';
import { Building2, Loader2 } from 'lucide-react';
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogHeader,
   DialogTitle,
} from "../ui/dialog";
import {
   Pagination,
   PaginationContent,
   PaginationEllipsis,
   PaginationItem,
   PaginationLink,
   PaginationNext,
   PaginationPrevious,
} from "../ui/pagination";
import { HotelCard } from './HotelCard';

/**
 * SearchResultsDialog - Premium dialog for displaying paginated hotel search results
 * Handles pagination, loading states, and empty states
 */
export function SearchResultsDialog({
   open,
   onOpenChange,
   searchQuery,
   results = [],
   loading = false,
   itemsPerPage = 12,
   onHotelSelect
}) {
   const [currentPage, setCurrentPage] = useState(1);

   // Reset to first page when results change
   useEffect(() => {
      if (results.length > 0) {
         setCurrentPage(1);
      }
   }, [results]);

   const totalPages = Math.ceil(results.length / itemsPerPage);
   const startIndex = (currentPage - 1) * itemsPerPage;
   const endIndex = startIndex + itemsPerPage;
   const currentHotels = results.slice(startIndex, endIndex);

   const handlePageChange = (page) => {
      setCurrentPage(page);
      // Scroll to top of dialog
      document.querySelector('.dialog-content')?.scrollTo({ top: 0, behavior: 'smooth' });
   };

   const renderPaginationItems = () => {
      const items = [];

      for (let i = 1; i <= totalPages; i++) {
         // Show first page, last page, current page, and pages around current
         if (
            i === 1 ||
            i === totalPages ||
            (i >= currentPage - 1 && i <= currentPage + 1)
         ) {
            items.push(
               <PaginationItem key={i}>
                  <PaginationLink
                     onClick={() => handlePageChange(i)}
                     isActive={currentPage === i}
                     className="cursor-pointer"
                  >
                     {i}
                  </PaginationLink>
               </PaginationItem>
            );
         } else if (i === currentPage - 2 || i === currentPage + 2) {
            items.push(
               <PaginationItem key={`ellipsis-${i}`}>
                  <PaginationEllipsis />
               </PaginationItem>
            );
         }
      }

      return items;
   };

   return (
      <Dialog open={open} onOpenChange={onOpenChange}>
         <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto dialog-content">
            <DialogHeader>
               <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                  <Building2 className="h-6 w-6 text-primary" />
                  Search Results for "{searchQuery}"
               </DialogTitle>
               <DialogDescription>
                  Found {results.length} hotel{results.length !== 1 ? 's' : ''} in {searchQuery}
               </DialogDescription>
            </DialogHeader>

            {loading ? (
               <div className="py-12 text-center">
                  <Loader2 className="mx-auto mb-4 h-8 w-8 animate-spin text-primary" />
                  <p className="text-muted-foreground">Searching hotels for {searchQuery}...</p>
               </div>
            ) : results.length > 0 ? (
               <>
                  {/* Hotels Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-6">
                     {currentHotels.map((hotel) => (
                        <HotelCard
                           key={hotel.id}
                           hotel={hotel}
                           onViewDetails={onHotelSelect}
                        />
                     ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                     <Pagination className="mt-6">
                        <PaginationContent>
                           <PaginationItem>
                              <PaginationPrevious
                                 onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                                 className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                              />
                           </PaginationItem>

                           {renderPaginationItems()}

                           <PaginationItem>
                              <PaginationNext
                                 onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                                 className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                              />
                           </PaginationItem>
                        </PaginationContent>
                     </Pagination>
                  )}
               </>
            ) : (
               <div className="py-12 text-center">
                  <p className="text-muted-foreground">No hotels found. Try a different search.</p>
               </div>
            )}
         </DialogContent>
      </Dialog>
   );
}
