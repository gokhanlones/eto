/**
 * Gerçek internet erişimini kontrol eder.
 * navigator.onLine tek başına güvenilir değil (Wi-Fi'ye bağlı ama internet yok olabilir),
 * bu yüzden küçük bir istekle doğruluyoruz.
 */
export async function checkInternet(timeoutMs = 5000): Promise<boolean> {
  if (!navigator.onLine) return false

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    await fetch('https://www.gstatic.com/generate_204', {
      mode: 'no-cors',
      cache: 'no-store',
      signal: controller.signal,
    })
    return true
  } catch {
    return false
  } finally {
    clearTimeout(timer)
  }
}
