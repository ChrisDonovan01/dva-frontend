/* global __firebase_config, __initial_auth_token, __looker_studio_embed_url, __app_id */
import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, query, orderBy, onSnapshot } from 'firebase/firestore';

// This is the MatrixPage component itself.
function MatrixPage(props) { // Accept props from App.js
    // Firebase initialization state
    const [db, setDb] = useState(null);
    const [auth, setAuth] = useState(null);
    const [userId, setUserId] = useState(null);
    const [isAuthReady, setIsAuthReady] = useState(false);

    // State to manage selected filters for the React list and Looker Studio
    const [selectedType, setSelectedType] = useState('all');
    const [selectedCategory, setSelectedCategory] = useState('all');

    // State for use cases fetched from Firestore
    const [useCases, setUseCases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    // Initialize Firebase and set up auth listener
    useEffect(() => {
        try {
            // Get firebaseConfig string from props
            const firebaseConfigString = props.__firebase_config;
            let firebaseConfig = {};

            // Robustly parse firebaseConfig: check if it's a valid string before parsing
            if (typeof firebaseConfigString === 'string' &&
                firebaseConfigString !== 'undefined' &&
                firebaseConfigString !== 'null' &&
                firebaseConfigString.trim() !== '') {
                try {
                    firebaseConfig = JSON.parse(firebaseConfigString);
                } catch (parseError) {
                    console.error("Error parsing firebaseConfig string:", parseError);
                    // If parsing fails, firebaseConfig remains an empty object, preventing TypeError
                }
            }

            if (Object.keys(firebaseConfig).length === 0) {
                console.error("Firebase config is missing or invalid. Cannot initialize Firebase.");
                return;
            }

            const app = initializeApp(firebaseConfig);
            const firestoreDb = getFirestore(app);
            const firebaseAuth = getAuth(app);

            setDb(firestoreDb);
            setAuth(firebaseAuth);

            const unsubscribe = onAuthStateChanged(firebaseAuth, async (user) => {
                if (user) {
                    setUserId(user.uid);
                    setIsAuthReady(true);
                } else {
                    try {
                        const initialAuthToken = typeof props.__initial_auth_token !== 'undefined'
                            ? props.__initial_auth_token
                            : null; // Fallback to null if prop is not provided

                        if (initialAuthToken) {
                            await signInWithCustomToken(firebaseAuth, initialAuthToken);
                            setUserId(firebaseAuth.currentUser.uid);
                        } else {
                            await signInAnonymously(firebaseAuth);
                            setUserId(crypto.randomUUID());
                        }
                    } catch (error) {
                        console.error("Firebase anonymous sign-in or custom token sign-in failed:", error);
                        setUserId(crypto.randomUUID());
                    } finally {
                        setIsAuthReady(true);
                    }
                }
            });
            return () => unsubscribe();
        } catch (error) {
            console.error("Error initializing Firebase:", error);
        }
    }, [props.__firebase_config, props.__initial_auth_token]);

    // Fetch use cases from Firestore
    useEffect(() => {
        if (!db || !isAuthReady) {
            return;
        }

        const fetchUseCases = async () => {
            try {
                const collectionPath = `prioritizedUseCases`;
                console.log("Frontend querying collection path:", collectionPath);

                const q = query(collection(db, collectionPath), orderBy('total_score', 'desc'));

                const unsubscribe = onSnapshot(q, (snapshot) => {
                    const useCasesData = snapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data()
                    }));
                    setUseCases(useCasesData);
                    setLoading(false);
                }, (err) => {
                    console.error("Error fetching use cases from Firestore:", err);
                    setError("Failed to load use cases. Please check console for details.");
                    setLoading(false);
                });
                return () => unsubscribe();
            } catch (err) {
                console.error("Error setting up Firestore listener:", err);
                setError("Failed to initialize data fetching. Please check console for details.");
                setLoading(false);
            }
        };

        fetchUseCases();
    }, [db, isAuthReady]);

    // Filter use cases for the React list based on selected filters
    const filteredUseCases = useCases.filter(uc =>
        (selectedType === 'all' || uc.type === selectedType) &&
        (selectedCategory === 'all' || uc.category_name === selectedCategory)
    );

    // Extract unique types and categories for dropdowns
    // Added .filter(Boolean) to ensure no null/undefined values are mapped
    const uniqueTypes = ['all', ...new Set(useCases.map(uc => uc.type).filter(Boolean))];
    const uniqueCategories = ['all', ...new Set(useCases.map(uc => uc.category_name).filter(Boolean))];


    // Looker Studio Embed URL: Use URL passed via props from App.js.
    const LOOKER_STUDIO_BASE_URL = typeof props.__looker_studio_embed_url !== 'undefined'
        ? props.__looker_studio_embed_url
        : "https://lookerstudio.google.com/embed/reporting/YOUR_REPORT_ID/page/YOUR_PAGE_ID"; // Fallback placeholder

    // Function to generate the filtered Looker Studio embed URL
    const generateFilteredEmbedUrl = () => {
        let url = LOOKER_STUDIO_BASE_URL;
        const params = [];

        // Append filters only if a specific value is selected (not 'all')
        // Corrected prefix to 'params.'
        if (selectedType !== 'all' && selectedType) {
            params.push(`params.type_filter=${encodeURIComponent(selectedType)}`);
        }
        if (selectedCategory !== 'all' && selectedCategory) {
            params.push(`params.category_filter=${encodeURIComponent(selectedCategory)}`);
        }

        if (params.length > 0) {
            url += (url.includes('?') ? '&' : '?') + params.join('&');
        }

        console.log("Generated Looker Studio URL:", url); // Debugging the generated URL
        return url;
    };

    const currentLookerStudioEmbedUrl = generateFilteredEmbedUrl();


    // UseCaseList component definition (remains largely the same, but now uses filteredUseCases)
    const UseCaseList = () => {
        if (loading) {
            return (
                <div className="bg-gray-100 p-4 rounded-lg shadow-md h-full flex items-center justify-center text-gray-800">
                    Loading Use Cases...
                </div>
            );
        }

        if (error) {
            return (
                <div className="bg-red-100 p-4 rounded-lg shadow-md h-full flex items-center justify-center text-red-800">
                    Error: {error}
                </div>
            );
        }

        if (useCases.length === 0) {
            return (
                <div className="bg-gray-100 p-4 rounded-lg shadow-md h-full flex items-center justify-center text-gray-800">
                    No use cases found.
                </div>
            );
        }

        return (
            <div className="bg-white p-4 rounded-lg shadow-md h-full overflow-y-auto">
                <h3 className="text-xl font-semibold text-[#446492] mb-4">Use Case Prioritization</h3> {/* Changed text color */}
                {/* Filter Dropdowns removed from here as they are moved to the top */}
                <ol className="list-decimal list-inside text-gray-800">
                    {filteredUseCases.length > 0 ? (
                        filteredUseCases.map((useCase) => (
                            <li key={useCase.id} className="mb-2">
                                <a href="javascript:void(0)" role="link" className="text-blue-600 hover:underline">
                                    {useCase.name}
                                </a>
                                {/* Removed Value and EOI scores */}
                            </li>
                        ))
                    ) : (
                        <li className="text-gray-600">No use cases match the selected filters.</li>
                    )}
                </ol>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-white text-gray-800 flex"> {/* Changed background to white */}
            <div className="flex-1 flex flex-col p-6">
                {/* Top Filters Section */}
                <div className="flex flex-col sm:flex-row gap-4 py-2 mb-2 items-center justify-start border-b border-gray-300"> {/* Adjusted py and mb */}
                    <div className="flex items-center gap-2">
                        <label htmlFor="typeFilter" className="text-gray-700 font-medium">Use Case Type:</label>
                        <select
                            id="typeFilter"
                            value={selectedType}
                            onChange={(e) => setSelectedType(e.target.value)}
                            className="block w-40 p-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-800 focus:ring-blue-500 focus:border-blue-500"
                        >
                            {uniqueTypes.map(type => (
                                <option key={type} value={type}>
                                    {type === 'all' ? 'All' : type}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="flex items-center gap-2">
                        <label htmlFor="categoryFilter" className="text-gray-700 font-medium">Use Case Category:</label>
                        <select
                            id="categoryFilter"
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="block w-40 p-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-800 focus:ring-blue-500 focus:border-blue-500"
                        >
                            {uniqueCategories.map(category => (
                                <option key={category} value={category}>
                                    {category === 'all' ? 'All' : category}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Main Content Area: Looker Studio Embed + Use Case List */}
                <div className="flex flex-col lg:flex-row flex-1 gap-6">
                    {/* Looker Studio Embed (Left/Main Section) */}
                    <div className="flex-1 bg-white rounded-lg shadow-md p-4 flex flex-col items-center justify-center min-h-[600px] lg:min-h-0"> {/* Changed background to white */}
                        {/* Main Title and Description - Moved inside the Looker Studio container */}
                        <div className="mt-4 mb-4 w-full text-center"> {/* Adjusted mt and mb */}
                            <h1 className="text-xl font-bold text-[#446492] mb-2">Data Product Prioritization Matrix</h1> {/* Changed font size and color */}
                            {/* Removed the "Interactive visualization..." paragraph */}
                        </div>

                        {LOOKER_STUDIO_BASE_URL && LOOKER_STUDIO_BASE_URL !== "https://lookerstudio.google.com/embed/reporting/YOUR_REPORT_ID/page/YOUR_PAGE_ID" ? (
                            <iframe
                                width="100%"
                                height="100%"
                                src={currentLookerStudioEmbedUrl} // Use the dynamically generated URL
                                frameBorder="0"
                                style={{ border: 0 }}
                                allowFullScreen
                                sandbox="allow-storage-access-by-user-activation allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
                                title="DVA Prioritization Matrix Dashboard"
                                className="rounded-md"
                            ></iframe>
                        ) : (
                            <div className="text-red-600 text-center p-4"> {/* Changed text color */}
                                <p className="font-bold mb-2">Looker Studio embed URL is not configured.</p>
                                <p>Please ensure `__looker_studio_embed_url` is provided in the environment (for Canvas) or `REACT_APP_LOOKER_STUDIO_EMBED_URL` is set in your .env.local file (for local development).</p>
                            </div>
                        )}
                    </div>

                    {/* Use Case Prioritization List (Right Sidebar Section) */}
                    <div className="w-full lg:w-1/4 flex-shrink-0">
                        <UseCaseList />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MatrixPage;
