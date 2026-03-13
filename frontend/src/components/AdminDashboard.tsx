import { Download, LockKeyhole, RefreshCw, ShieldCheck } from 'lucide-react';
import type { AdminMessagesResponse } from '../types';

export function AdminDashboard(props: {
  adminKey: string;
  setAdminKey: (value: string) => void;
  adminData: AdminMessagesResponse | null;
  adminError: string | null;
  adminLoading: boolean;
  onLoadMessages: () => void;
  getExportLink: (format: 'json' | 'csv') => string;
}) {
  const { adminKey, setAdminKey, adminData, adminError, adminLoading, onLoadMessages, getExportLink } = props;

  return (
    <section id="admin" className="py-20 px-4 pb-32">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-200 mb-4">
            <ShieldCheck className="h-4 w-4" />
            Admin dashboard
          </div>
          <h2 className="text-4xl md:text-5xl font-bold">View and export contact leads</h2>
          <p className="text-gray-300 max-w-2xl mx-auto mt-4">
            Enter your admin key to load messages, check whether email notifications are enabled, and download the latest contact data.
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 md:p-8 shadow-2xl">
          <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-8 items-start">
            <div className="space-y-4">
              <label className="block">
                <span className="mb-2 flex items-center gap-2 text-sm uppercase tracking-[0.3em] text-gray-400">
                  <LockKeyhole className="h-4 w-4" />
                  Admin key
                </span>
                <input
                  type="password"
                  value={adminKey}
                  onChange={(e) => setAdminKey(e.target.value)}
                  placeholder="Enter ADMIN_DASHBOARD_KEY"
                  className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 outline-none focus:border-purple-400"
                />
              </label>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={onLoadMessages}
                  disabled={adminLoading || !adminKey.trim()}
                  className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 px-5 py-3 font-medium hover:opacity-90 transition disabled:opacity-50"
                >
                  <RefreshCw className={`h-4 w-4 ${adminLoading ? 'animate-spin' : ''}`} />
                  {adminLoading ? 'Loading...' : 'Load messages'}
                </button>
                <a
                  href={adminKey ? getExportLink('json') : undefined}
                  className={`inline-flex items-center gap-2 rounded-2xl border border-white/10 px-5 py-3 transition ${adminKey ? 'hover:bg-white/10' : 'pointer-events-none opacity-50'}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Download className="h-4 w-4" /> JSON export
                </a>
                <a
                  href={adminKey ? getExportLink('csv') : undefined}
                  className={`inline-flex items-center gap-2 rounded-2xl border border-white/10 px-5 py-3 transition ${adminKey ? 'hover:bg-white/10' : 'pointer-events-none opacity-50'}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Download className="h-4 w-4" /> CSV export
                </a>
              </div>
              {adminError ? <div className="rounded-2xl border border-red-400/30 bg-red-500/10 p-4 text-red-200">{adminError}</div> : null}
            </div>

            <div className="grid sm:grid-cols-3 lg:grid-cols-1 gap-4">
              <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
                <div className="text-sm text-gray-400">Stored messages</div>
                <div className="text-3xl font-bold mt-2">{adminData?.meta.total ?? '--'}</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
                <div className="text-sm text-gray-400">Storage</div>
                <div className="text-xl font-semibold mt-2 uppercase">{adminData?.meta.storage ?? '--'}</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
                <div className="text-sm text-gray-400">Email notifications</div>
                <div className="text-xl font-semibold mt-2">{adminData ? (adminData.meta.emailNotifications ? 'Enabled' : 'Disabled') : '--'}</div>
              </div>
            </div>
          </div>

          <div className="mt-8 overflow-hidden rounded-3xl border border-white/10">
            <div className="max-h-[520px] overflow-auto">
              <table className="w-full min-w-[760px] border-collapse">
                <thead className="sticky top-0 bg-[#12071f]">
                  <tr className="text-left text-sm text-gray-300">
                    <th className="px-4 py-3 font-medium">Date</th>
                    <th className="px-4 py-3 font-medium">Name</th>
                    <th className="px-4 py-3 font-medium">Email</th>
                    <th className="px-4 py-3 font-medium">Subject</th>
                    <th className="px-4 py-3 font-medium">Message</th>
                  </tr>
                </thead>
                <tbody>
                  {adminData?.messages.length ? (
                    adminData.messages.map((message) => (
                      <tr key={message.id} className="border-t border-white/10 align-top text-sm">
                        <td className="px-4 py-4 text-gray-300 whitespace-nowrap">{new Date(message.createdAt).toLocaleString()}</td>
                        <td className="px-4 py-4 font-medium">{message.name}</td>
                        <td className="px-4 py-4">
                          <a href={`mailto:${message.email}`} className="text-purple-200 underline-offset-4 hover:underline">{message.email}</a>
                        </td>
                        <td className="px-4 py-4 text-gray-200">{message.subject}</td>
                        <td className="px-4 py-4 text-gray-300 whitespace-pre-wrap">{message.message}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-4 py-12 text-center text-gray-400">
                        {adminData ? 'No messages yet.' : 'Load your admin dashboard to see contact submissions here.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
