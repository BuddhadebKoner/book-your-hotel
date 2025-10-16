import { useState } from 'react';
import { API_CATEGORIES } from '../../services/liteApiService';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';

function DevPage() {
   const [selectedCategory, setSelectedCategory] = useState(null);
   const [selectedApi, setSelectedApi] = useState(null);
   const [loading, setLoading] = useState(false);
   const [response, setResponse] = useState(null);
   const [error, setError] = useState(null);

   const handleApiCall = async (api) => {
      setLoading(true);
      setError(null);
      setResponse(null);
      setSelectedApi(api);

      try {
         const result = await api.execute(api.sampleParams);
         setResponse(result);
      } catch (err) {
         setError(err.message);
      } finally {
         setLoading(false);
      }
   };

   return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
         {/* Header */}
         <div className="border-b bg-white dark:bg-slate-900 shadow-sm">
            <div className="container mx-auto px-4 py-6">
               <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  🚀 LiteAPI Development Console
               </h1>
               <p className="text-slate-600 dark:text-slate-400 mt-2">
                  Test and explore all LiteAPI endpoints
               </p>
            </div>
         </div>

         <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
               {/* API Categories Sidebar */}
               <div className="lg:col-span-1">
                  <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6 sticky top-6">
                     <h2 className="text-xl font-bold mb-4 text-slate-800 dark:text-white">
                        API Categories
                     </h2>
                     <div className="space-y-3">
                        {Object.entries(API_CATEGORIES).map(([key, category]) => (
                           <button
                              key={key}
                              onClick={() => {
                                 setSelectedCategory(key);
                                 setSelectedApi(null);
                                 setResponse(null);
                                 setError(null);
                              }}
                              className={`w-full text-left p-4 rounded-lg transition-all ${selectedCategory === key
                                 ? 'bg-blue-500 text-white shadow-lg transform scale-105'
                                 : 'bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600'
                                 }`}
                           >
                              <div className="flex items-center gap-3">
                                 <span className="text-2xl">{category.icon}</span>
                                 <div className="flex-1">
                                    <div className="font-semibold">{category.name}</div>
                                    <div className={`text-xs mt-1 ${selectedCategory === key ? 'text-blue-100' : 'text-slate-500 dark:text-slate-400'
                                       }`}>
                                       {category.apis.length} endpoints
                                    </div>
                                 </div>
                                 {category.requiresAuth && (
                                    <span className="text-xs bg-orange-500 text-white px-2 py-1 rounded">
                                       🔒 Private
                                    </span>
                                 )}
                              </div>
                           </button>
                        ))}
                     </div>
                  </div>
               </div>

               {/* Main Content */}
               <div className="lg:col-span-2">
                  {!selectedCategory ? (
                     <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-12 text-center">
                        <div className="text-6xl mb-4">👈</div>
                        <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">
                           Select a Category
                        </h3>
                        <p className="text-slate-600 dark:text-slate-400">
                           Choose an API category from the sidebar to get started
                        </p>
                     </div>
                  ) : (
                     <>
                        {/* Category Info */}
                        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6 mb-6">
                           <div className="flex items-center gap-3 mb-2">
                              <span className="text-3xl">{API_CATEGORIES[selectedCategory].icon}</span>
                              <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
                                 {API_CATEGORIES[selectedCategory].name}
                              </h2>
                           </div>
                           <p className="text-slate-600 dark:text-slate-400">
                              {API_CATEGORIES[selectedCategory].description}
                           </p>
                        </div>

                        {/* API Endpoints */}
                        <div className="space-y-4">
                           {API_CATEGORIES[selectedCategory].apis.map((api) => (
                              <div
                                 key={api.id}
                                 className="bg-white dark:bg-slate-800 rounded-lg shadow-md overflow-hidden"
                              >
                                 <div className="p-6">
                                    <div className="flex items-start justify-between mb-4">
                                       <div className="flex-1">
                                          <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-1">
                                             {api.name}
                                          </h3>
                                          <code className="text-sm bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded text-blue-600 dark:text-blue-400">
                                             {api.endpoint}
                                          </code>
                                          <p className="text-slate-600 dark:text-slate-400 mt-2">
                                             {api.description}
                                          </p>
                                       </div>
                                       <Button
                                          onClick={() => handleApiCall(api)}
                                          disabled={loading}
                                          className="ml-4 bg-blue-500 hover:bg-blue-600"
                                       >
                                          {loading && selectedApi?.id === api.id ? (
                                             <>
                                                <span className="animate-spin mr-2">⏳</span>
                                                Loading...
                                             </>
                                          ) : (
                                             <>
                                                <span className="mr-2">▶️</span>
                                                Test API
                                             </>
                                          )}
                                       </Button>
                                    </div>

                                    {/* Sample Parameters */}
                                    {api.sampleParams && (
                                       <div className="mt-4">
                                          <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                             Sample Parameters:
                                          </h4>
                                          <pre className="bg-slate-100 dark:bg-slate-700 p-3 rounded text-xs overflow-x-auto">
                                             {JSON.stringify(api.sampleParams, null, 2)}
                                          </pre>
                                       </div>
                                    )}

                                    {/* Response Display */}
                                    {selectedApi?.id === api.id && (
                                       <div className="mt-4 border-t pt-4">
                                          {error && (
                                             <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                                                <div className="flex items-center gap-2 mb-2">
                                                   <span className="text-2xl">❌</span>
                                                   <h4 className="font-bold text-red-800 dark:text-red-300">Error</h4>
                                                </div>
                                                <p className="text-red-600 dark:text-red-400">{error}</p>
                                             </div>
                                          )}

                                          {response && (
                                             <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                                                <div className="flex items-center justify-between mb-3">
                                                   <div className="flex items-center gap-2">
                                                      <span className="text-2xl">✅</span>
                                                      <h4 className="font-bold text-green-800 dark:text-green-300">Success</h4>
                                                   </div>
                                                   <button
                                                      onClick={() => {
                                                         navigator.clipboard.writeText(JSON.stringify(response, null, 2));
                                                         alert('Response copied to clipboard!');
                                                      }}
                                                      className="text-xs bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                                                   >
                                                      📋 Copy JSON
                                                   </button>
                                                </div>

                                                {/* Response Stats */}
                                                <div className="grid grid-cols-3 gap-4 mb-3">
                                                   <div className="bg-white dark:bg-slate-800 p-3 rounded">
                                                      <div className="text-xs text-slate-600 dark:text-slate-400">Status</div>
                                                      <div className="text-lg font-bold text-green-600">200 OK</div>
                                                   </div>
                                                   <div className="bg-white dark:bg-slate-800 p-3 rounded">
                                                      <div className="text-xs text-slate-600 dark:text-slate-400">Records</div>
                                                      <div className="text-lg font-bold text-blue-600">
                                                         {response.data ? (Array.isArray(response.data) ? response.data.length : '1') : 'N/A'}
                                                      </div>
                                                   </div>
                                                   <div className="bg-white dark:bg-slate-800 p-3 rounded">
                                                      <div className="text-xs text-slate-600 dark:text-slate-400">Size</div>
                                                      <div className="text-lg font-bold text-purple-600">
                                                         {(JSON.stringify(response).length / 1024).toFixed(2)} KB
                                                      </div>
                                                   </div>
                                                </div>

                                                {/* JSON Response */}
                                                <div className="max-h-96 overflow-y-auto">
                                                   <pre className="bg-slate-900 text-green-400 p-4 rounded text-xs">
                                                      {JSON.stringify(response, null, 2)}
                                                   </pre>
                                                </div>
                                             </div>
                                          )}
                                       </div>
                                    )}
                                 </div>
                              </div>
                           ))}
                        </div>
                     </>
                  )}
               </div>
            </div>
         </div>
      </div>
   );
}

export default DevPage;
