import ScrollContainer from '../components/ScrollContainer';
import RequestStats from '../components/requests/RequestStats';
import RequestItem from '../components/requests/RequestItem';
import RequestEmptyState from '../components/requests/RequestEmptyState';
import { useSentRequests } from '../hooks/useSentRequests';

export default function SentRequestsPage() {
  const {
    sentRequests,
    loading,
    cancelRequest,
    deleteRequest,
    getCounts
  } = useSentRequests();

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gradient-to-b from-[#FFF5E6] to-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-[#F68537] mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading sent requests...</p>
        </div>
      </div>
    );
  }

  const counts = getCounts();

  return (
    <ScrollContainer className="bg-gradient-to-b from-[#FFF5E6] to-white">
      <div className="max-w-4xl mx-auto p-4 md:p-6 pb-8">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-3">
                📤 Sent Requests
                {counts.pending > 0 && (
                  <span className="bg-blue-500 text-white text-sm px-3 py-1 rounded-full">
                    {counts.pending} pending
                  </span>
                )}
              </h1>
              <p className="text-gray-600 mt-1">Friend requests you've sent</p>
            </div>
          </div>

          {/* Stats */}
          <RequestStats counts={counts} type="sent" />
        </div>

        {/* Sent Requests List */}
        {sentRequests.length === 0 ? (
          <RequestEmptyState type="sent" />
        ) : (
          <div className="space-y-3">
            {sentRequests.map((request) => (
              <RequestItem
                key={request.id}
                request={request}
                type="sent"
                onCancel={cancelRequest}
                onDelete={deleteRequest}
              />
            ))}
          </div>
        )}
      </div>
    </ScrollContainer>
  );
}