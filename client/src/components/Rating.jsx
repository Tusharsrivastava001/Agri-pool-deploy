import React, { useState, useEffect } from 'react';
import { Star, Loader2, CheckCircle } from 'lucide-react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

export default function RatingWidget({ targetUserId, transportRequestId, readOnly = false }) {
    const { user } = useAuth();
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState('');
    const [stats, setStats] = useState({ average: 0, total: 0 });
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (targetUserId) {
            fetchRatings();
        }
    }, [targetUserId]);

    const fetchRatings = async () => {
        try {
            const res = await api.get(`/api/review/${targetUserId}`);
            setStats({
                average: res.data.averageRating || 0,
                total: res.data.totalReviews || 0,
            });
        } catch (err) {
            console.error("Error fetching ratings:", err);
        }
    };

    const handleSubmit = async () => {
        if (!user || rating === 0) return;
        try {
            setLoading(true);
            setError('');
            await api.post('/api/review', {
                revieweeId: targetUserId,
                transportRequestId,
                rating,
                comment,
            });
            setSubmitted(true);
            fetchRatings(); // Refresh stats
        } catch (err) {
            setError(err.response?.data?.error || "Error submitting review");
        } finally {
            setLoading(false);
        }
    };

    // If readOnly, just show the average rating
    if (readOnly) {
        return (
            <div className="flex items-center gap-1 text-sm font-bold text-yellow-500">
                <Star className="fill-yellow-500 w-4 h-4" />
                {stats.average > 0 ? stats.average.toFixed(1) : 'New'}
                <span className="text-gray-400 dark:text-gray-500 text-xs ml-1 font-medium">
                    ({stats.total})
                </span>
            </div>
        );
    }

    // Interactive review form
    if (user?.id === targetUserId) return null; // Can't review yourself

    return (
        <div className="mt-4 p-4 rounded-2xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 shadow-sm">
            <h4 className="font-bold text-sm mb-3 text-gray-800 dark:text-gray-200">Rate this interaction</h4>

            {submitted ? (
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-sm font-bold">
                    <CheckCircle size={18} /> Review submitted!
                </div>
            ) : (
                <div className="space-y-3">
                    <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                onMouseEnter={() => setHoverRating(star)}
                                onMouseLeave={() => setHoverRating(0)}
                                onClick={() => setRating(star)}
                                className="transition-colors outline-none focus:outline-none"
                            >
                                <Star
                                    className={`w-6 h-6 transition-all ${star <= (hoverRating || rating) ? 'fill-yellow-500 text-yellow-500 scale-110 drop-shadow-[0_0_8px_rgba(234,179,8,0.5)]' : 'text-gray-300 dark:text-gray-600'}`}
                                />
                            </button>
                        ))}
                    </div>

                    <textarea
                        placeholder="Add a comment... (optional)"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="w-full p-3 rounded-xl text-sm outline-none transition-colors border bg-gray-50 dark:bg-black/20 border-gray-200 dark:border-white/10 focus:border-yellow-500 dark:text-white"
                        rows={2}
                    />

                    {error && <p className="text-red-500 text-xs font-bold">{error}</p>}

                    <button
                        onClick={handleSubmit}
                        disabled={rating === 0 || loading}
                        className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white font-bold text-sm rounded-xl transition-all disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2"
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Submit Rating'}
                    </button>
                </div>
            )}
        </div>
    );
}
