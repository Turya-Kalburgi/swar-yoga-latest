import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Clock, CheckCircle, AlertCircle, BarChart3 } from 'lucide-react';
import axios from 'axios';

interface MyCourse {
  _id: string;
  workshopId: {
    _id: string;
    title: string;
    thumbnail: string;
  };
  status: string;
  progressPercentage: number;
  startDate: string;
  enrollmentId: string;
}

export default function MyCoursesPage() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<MyCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'completed'>('all');

  useEffect(() => {
    fetchMyCourses();
  }, []);

  const fetchMyCourses = async () => {
    try {
      setLoading(true);
      const userStr = localStorage.getItem('user');
      if (!userStr) {
        navigate('/signin');
        return;
      }

      const user = JSON.parse(userStr);
      const userId = user.id || user._id;

      const response = await axios.get(`/api/student-progress/user/${userId}`, {
        headers: { 'X-User-ID': userId }
      });

      const data = response.data.data || response.data;
      setCourses(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching courses:', error);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredCourses = () => {
    if (activeTab === 'active') {
      return courses.filter((c) => c.status === 'active');
    } else if (activeTab === 'completed') {
      return courses.filter((c) => c.status === 'completed');
    }
    return courses;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your courses...</p>
        </div>
      </div>
    );
  }

  const filteredCourses = getFilteredCourses();

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">My Courses</h1>
          <p className="text-gray-600">Continue learning from where you left off</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-200">
          {(['all', 'active', 'completed'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 font-medium text-lg transition-colors border-b-2 ${
                activeTab === tab
                  ? 'text-indigo-600 border-indigo-600'
                  : 'text-gray-600 border-transparent hover:text-gray-800'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)} Courses
            </button>
          ))}
        </div>

        {filteredCourses.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">No courses found in this category</p>
            <button
              onClick={() => navigate('/workshops')}
              className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Browse Workshops
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <div
                key={course._id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden"
              >
                {/* Thumbnail */}
                <div className="relative h-40 bg-gray-200 overflow-hidden group">
                  <img
                    src={course.workshopId.thumbnail}
                    alt={course.workshopId.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <button
                    onClick={() =>
                      navigate(`/course/${course.enrollmentId}/player`)
                    }
                    className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Play className="w-12 h-12 text-white fill-white" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="text-lg font-bold text-gray-800 mb-3 line-clamp-2">
                    {course.workshopId.title}
                  </h3>

                  {/* Progress */}
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">Progress</span>
                      <span className="text-sm font-semibold text-indigo-600">
                        {course.progressPercentage}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-indigo-600 h-2 rounded-full transition-all"
                        style={{ width: `${course.progressPercentage}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="flex items-center gap-2 mb-4">
                    {course.status === 'completed' ? (
                      <>
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span className="text-sm text-green-700">Completed</span>
                      </>
                    ) : (
                      <>
                        <Clock className="w-5 h-5 text-orange-500" />
                        <span className="text-sm text-orange-700">In Progress</span>
                      </>
                    )}
                  </div>

                  {/* Button */}
                  <button
                    onClick={() =>
                      navigate(`/course/${course.enrollmentId}/player`)
                    }
                    className="w-full px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700"
                  >
                    Continue Learning
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
