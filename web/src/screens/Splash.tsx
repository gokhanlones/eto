/** Açılış ekranı: kontroller yapılırken ekranda sadece ETO yazısı görünür. */
export default function Splash() {
  return (
    <div className="splash" role="status" aria-label="Loading">
      <h1 className="splash-logo">ETO</h1>
    </div>
  )
}
