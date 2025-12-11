import ScrollContainer from '../components/ScrollContainer';
import RequestStats from '../components/requests/RequestStats';
import RequestItem from '../components/requests/RequestItem';
import RequestEmptyState from '../components/requests/RequestEmptyState';
import { useReceivedRequests } from '../hooks/useReceivedRequests';

export default function ReceivedRequestsPage() {
  const {
    receivedRequests,
    loading,
    acceptRequest,
    rejectRequest,
    deleteRequest,
    getCounts
  } = useReceivedRequests();

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gradient-to-b from-[#FFF5E6] to-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-[#F68537] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading requests...</p>
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
                📥 Received Requests
                {counts.pending > 0 && (
                  <span className="bg-green-500 text-white text-sm px-3 py-1 rounded-full">
                    {counts.pending} pending
                  </span>
                )}
              </h1>
              <p className="text-gray-600 mt-1">Friend requests you've received</p>
            </div>
          </div>

          {/* Stats - Note: different color for pending (yellow instead of blue) */}
          <div className="grid grid-cols-4 gap-3 md:gap-4">
            <div className="bg-yellow-50 rounded-lg p-3 text-center border-2 border-yellow-200">
              <div className="text-2xl md:text-3xl font-bold text-yellow-600">{counts.pending}</div>
              <div className="text-xs md:text-sm text-yellow-800 mt-1">Pending</div>
            </div>
            <div className="bg-green-50 rounded-lg p-3 text-center border-2 border-green-200">
              <div className="text-2xl md:text-3xl font-bold text-green-600">{counts.accepted}</div>
              <div className="text-xs md:text-sm text-green-800 mt-1">Accepted</div>
            </div>
            <div className="bg-red-50 rounded-lg p-3 text-center border-2 border-red-200">
              <div className="text-2xl md:text-3xl font-bold text-red-600">{counts.rejected}</div>
              <div className="text-xs md:text-sm text-red-800 mt-1">Rejected</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 text-center border-2 border-gray-200">
              <div className="text-2xl md:text-3xl font-bold text-gray-600">{counts.total}</div>
              <div className="text-xs md:text-sm text-gray-800 mt-1">Total</div>
            </div>
          </div>
        </div>

        {/* Received Requests List */}
        {receivedRequests.length === 0 ? (
          <RequestEmptyState type="received" />
        ) : (
          <div className="space-y-4">
            {receivedRequests.map((request) => (
              <RequestItem
                key={request.id}
                request={request}
                type="received"
                onAccept={acceptRequest}
                onReject={rejectRequest}
                onDelete={deleteRequest}
              />
            ))}
          </div>
        )}
      </div>
    </ScrollContainer>
  );
}