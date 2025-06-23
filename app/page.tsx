"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Copy, Shield, Zap, Eye, EyeOff, RefreshCw, History, Trash2, AlertTriangle, Lock } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface PasswordHistoryItem {
  id: string
  password: string
  timestamp: number
  length: number
  options: {
    uppercase: boolean
    lowercase: boolean
    digits: boolean
    special: boolean
    excludeSimilar: boolean
  }
}

export default function CyberPasswordGenerator() {
  const [password, setPassword] = useState("")
  const [length, setLength] = useState([16])
  const [options, setOptions] = useState({
    uppercase: true,
    lowercase: true,
    digits: true,
    special: true,
    excludeSimilar: false,
  })
  const [showPassword, setShowPassword] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)
  const [glitchText, setGlitchText] = useState("SECURE PASSWORD GENERATOR")
  const [passwordHistory, setPasswordHistory] = useState<PasswordHistoryItem[]>([])
  const [showHistory, setShowHistory] = useState(false)
  const [visibleHistoryItems, setVisibleHistoryItems] = useState<Set<string>>(new Set())

  // Encryption key for local storage
  const getEncryptionKey = async (): Promise<CryptoKey> => {
    const keyData = "cybersec-pwd-gen-2024-secure-key"
    const encoder = new TextEncoder()
    const keyMaterial = await crypto.subtle.importKey("raw", encoder.encode(keyData), { name: "PBKDF2" }, false, [
      "deriveBits",
      "deriveKey",
    ])

    return crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt: encoder.encode("cybersec-salt"),
        iterations: 100000,
        hash: "SHA-256",
      },
      keyMaterial,
      { name: "AES-GCM", length: 256 },
      false,
      ["encrypt", "decrypt"],
    )
  }

  // Encrypt data for storage
  const encryptData = async (data: string): Promise<string> => {
    try {
      const key = await getEncryptionKey()
      const encoder = new TextEncoder()
      const iv = crypto.getRandomValues(new Uint8Array(12))

      const encrypted = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, encoder.encode(data))

      const combined = new Uint8Array(iv.length + encrypted.byteLength)
      combined.set(iv)
      combined.set(new Uint8Array(encrypted), iv.length)

      return btoa(String.fromCharCode(...combined))
    } catch (error) {
      console.error("Encryption failed:", error)
      return ""
    }
  }

  // Decrypt data from storage
  const decryptData = async (encryptedData: string): Promise<string> => {
    try {
      const key = await getEncryptionKey()
      const combined = new Uint8Array(
        atob(encryptedData)
          .split("")
          .map((char) => char.charCodeAt(0)),
      )

      const iv = combined.slice(0, 12)
      const encrypted = combined.slice(12)

      const decrypted = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, encrypted)

      return new TextDecoder().decode(decrypted)
    } catch (error) {
      console.error("Decryption failed:", error)
      return ""
    }
  }

  // Load password history from encrypted local storage
  const loadPasswordHistory = async () => {
    try {
      const encryptedHistory = localStorage.getItem("cybersec-pwd-history")
      if (encryptedHistory) {
        const decryptedHistory = await decryptData(encryptedHistory)
        if (decryptedHistory) {
          const history = JSON.parse(decryptedHistory)
          setPasswordHistory(history)
        }
      }
    } catch (error) {
      console.error("Failed to load password history:", error)
    }
  }

  // Save password history to encrypted local storage
  const savePasswordHistory = async (history: PasswordHistoryItem[]) => {
    try {
      const encryptedHistory = await encryptData(JSON.stringify(history))
      if (encryptedHistory) {
        localStorage.setItem("cybersec-pwd-history", encryptedHistory)
      }
    } catch (error) {
      console.error("Failed to save password history:", error)
    }
  }

  // Add password to history
  const addToHistory = async (newPassword: string) => {
    const historyItem: PasswordHistoryItem = {
      id: crypto.randomUUID(),
      password: newPassword,
      timestamp: Date.now(),
      length: length[0],
      options: { ...options },
    }

    const updatedHistory = [historyItem, ...passwordHistory].slice(0, 50) // Keep only last 50
    setPasswordHistory(updatedHistory)
    await savePasswordHistory(updatedHistory)
  }

  // Remove item from history
  const removeFromHistory = async (id: string) => {
    const updatedHistory = passwordHistory.filter((item) => item.id !== id)
    setPasswordHistory(updatedHistory)
    await savePasswordHistory(updatedHistory)
    setVisibleHistoryItems((prev) => {
      const newSet = new Set(prev)
      newSet.delete(id)
      return newSet
    })

    toast({
      title: "HISTORY ITEM DELETED",
      description: "Password removed from secure history.",
    })
  }

  // Clear all history
  const clearAllHistory = async () => {
    setPasswordHistory([])
    setVisibleHistoryItems(new Set())
    localStorage.removeItem("cybersec-pwd-history")

    toast({
      title: "HISTORY CLEARED",
      description: "All password history has been securely deleted.",
    })
  }

  // Toggle password visibility in history
  const toggleHistoryItemVisibility = (id: string) => {
    setVisibleHistoryItems((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  // Copy from history
  const copyFromHistory = async (password: string) => {
    try {
      await navigator.clipboard.writeText(password)
      toast({
        title: "COPIED FROM HISTORY",
        description: "Password retrieved from secure vault.",
      })
    } catch (err) {
      toast({
        title: "COPY FAILED",
        description: "Unable to access clipboard.",
        variant: "destructive",
      })
    }
  }

  // Load history on component mount
  useEffect(() => {
    loadPasswordHistory()
  }, [])

  // Glitch effect for title
  useEffect(() => {
    const glitchChars = "!@#$%^&*()_+-=[]{}|;:,.<>?"
    const originalText = "SECURE PASSWORD GENERATOR"

    const glitchInterval = setInterval(() => {
      if (Math.random() < 0.1) {
        const glitched = originalText
          .split("")
          .map((char) => (Math.random() < 0.1 ? glitchChars[Math.floor(Math.random() * glitchChars.length)] : char))
          .join("")
        setGlitchText(glitched)

        setTimeout(() => setGlitchText(originalText), 100)
      }
    }, 200)

    return () => clearInterval(glitchInterval)
  }, [])

  const generateSecurePassword = () => {
    setIsGenerating(true)

    // Simulate processing time for effect
    setTimeout(async () => {
      let charset = ""

      if (options.uppercase) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
      if (options.lowercase) charset += "abcdefghijklmnopqrstuvwxyz"
      if (options.digits) charset += "0123456789"
      if (options.special) charset += "!@#$%^&*()_+-=[]{}|;:,.<>?"

      if (options.excludeSimilar) {
        charset = charset.replace(/[Il1O0]/g, "")
      }

      if (!charset) {
        toast({
          title: "ERROR: INVALID CONFIGURATION",
          description: "At least one character type must be selected.",
          variant: "destructive",
        })
        setIsGenerating(false)
        return
      }

      let result = ""
      const array = new Uint32Array(length[0])
      crypto.getRandomValues(array)

      for (let i = 0; i < length[0]; i++) {
        result += charset[array[i] % charset.length]
      }

      setPassword(result)
      await addToHistory(result)
      setIsGenerating(false)

      toast({
        title: "PASSWORD GENERATED",
        description: "Cryptographically secure password created and stored.",
      })
    }, 800)
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(password)
      toast({
        title: "COPIED TO CLIPBOARD",
        description: "Password has been secured in clipboard.",
      })
    } catch (err) {
      toast({
        title: "COPY FAILED",
        description: "Unable to access clipboard.",
        variant: "destructive",
      })
    }
  }

  const getStrengthLevel = () => {
    let score = 0
    if (options.uppercase) score++
    if (options.lowercase) score++
    if (options.digits) score++
    if (options.special) score++

    if (length[0] >= 12) score++
    if (length[0] >= 16) score++

    if (score <= 2) return { level: "WEAK", color: "text-red-400", width: "25%" }
    if (score <= 4) return { level: "MODERATE", color: "text-yellow-400", width: "50%" }
    if (score <= 5) return { level: "STRONG", color: "text-green-400", width: "75%" }
    return { level: "MAXIMUM", color: "text-cyan-400", width: "100%" }
  }

  const strength = getStrengthLevel()

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono relative overflow-hidden">
      {/* Matrix background effect */}
      <div className="fixed inset-0 opacity-10">
        <div className="matrix-bg"></div>
      </div>

      {/* Scan lines */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="scan-lines"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 glitch-text">{glitchText}</h1>
          <div className="flex items-center justify-center gap-2 text-cyan-400">
            <Shield className="w-6 h-6" />
            <span className="text-lg">MILITARY-GRADE ENCRYPTION</span>
            <Shield className="w-6 h-6" />
          </div>
        </div>

        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
          {/* Configuration Panel */}
          <Card className="bg-gray-900/50 border-green-400/30 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-green-400 flex items-center gap-2">
                <Zap className="w-5 h-5" />
                CONFIGURATION MATRIX
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Password Length */}
              <div className="space-y-3">
                <Label className="text-cyan-400 text-sm font-bold">PASSWORD LENGTH: {length[0]}</Label>
                <Slider value={length} onValueChange={setLength} max={64} min={8} step={1} className="slider-cyber" />
                <div className="flex justify-between text-xs text-gray-400">
                  <span>8</span>
                  <span>64</span>
                </div>
              </div>

              {/* Character Options */}
              <div className="space-y-4">
                <Label className="text-cyan-400 text-sm font-bold">CHARACTER SETS</Label>

                {[
                  { key: "uppercase", label: "UPPERCASE LETTERS [A-Z]" },
                  { key: "lowercase", label: "lowercase letters [a-z]" },
                  { key: "digits", label: "DIGITS [0-9]" },
                  { key: "special", label: "SPECIAL CHARS [!@#$%^&*]" },
                  { key: "excludeSimilar", label: "EXCLUDE SIMILAR [Il1O0]" },
                ].map(({ key, label }) => (
                  <div key={key} className="flex items-center space-x-3">
                    <Checkbox
                      id={key}
                      checked={options[key as keyof typeof options]}
                      onCheckedChange={(checked) => setOptions((prev) => ({ ...prev, [key]: checked }))}
                      className="border-green-400 data-[state=checked]:bg-green-400 data-[state=checked]:text-black"
                    />
                    <Label htmlFor={key} className="text-sm cursor-pointer hover:text-green-300">
                      {label}
                    </Label>
                  </div>
                ))}
              </div>

              {/* Security Level */}
              <div className="space-y-2">
                <Label className="text-cyan-400 text-sm font-bold">SECURITY LEVEL</Label>
                <div className="bg-gray-800 rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${strength.color.replace("text-", "bg-")}`}
                    style={{ width: strength.width }}
                  />
                </div>
                <div className={`text-sm font-bold ${strength.color}`}>{strength.level}</div>
              </div>
            </CardContent>
          </Card>

          {/* Generation Panel */}
          <Card className="bg-gray-900/50 border-green-400/30 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-green-400 flex items-center gap-2 justify-between">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  SECURE OUTPUT
                </div>
                <Dialog open={showHistory} onOpenChange={setShowHistory}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black"
                    >
                      <History className="w-4 h-4 mr-1" />
                      HISTORY ({passwordHistory.length})
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-gray-900 border-green-400/30 text-green-400 max-w-4xl max-h-[80vh] overflow-hidden">
                    <DialogHeader>
                      <DialogTitle className="text-green-400 flex items-center gap-2">
                        <Lock className="w-5 h-5" />
                        ENCRYPTED PASSWORD VAULT
                      </DialogTitle>
                    </DialogHeader>

                    {/* Security Warning */}
                    <div className="bg-yellow-900/20 border border-yellow-400/30 rounded p-3 mb-4">
                      <div className="flex items-center gap-2 text-yellow-400 text-sm font-bold mb-1">
                        <AlertTriangle className="w-4 h-4" />
                        SECURITY NOTICE
                      </div>
                      <div className="text-xs text-gray-300">
                        Passwords are encrypted and stored locally. Clear history regularly for maximum security.
                      </div>
                    </div>

                    <div className="flex justify-between items-center mb-4">
                      <div className="text-sm text-gray-400">{passwordHistory.length} passwords stored (max 50)</div>
                      {passwordHistory.length > 0 && (
                        <Button
                          onClick={clearAllHistory}
                          variant="destructive"
                          size="sm"
                          className="bg-red-900/50 border-red-400 text-red-400 hover:bg-red-400 hover:text-black"
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          CLEAR ALL
                        </Button>
                      )}
                    </div>

                    <div className="overflow-y-auto max-h-96 space-y-2">
                      {passwordHistory.length === 0 ? (
                        <div className="text-center text-gray-400 py-8">
                          <History className="w-12 h-12 mx-auto mb-2 opacity-50" />
                          <div>No passwords in history</div>
                          <div className="text-xs">Generate passwords to build your secure vault</div>
                        </div>
                      ) : (
                        passwordHistory.map((item) => (
                          <div
                            key={item.id}
                            className="bg-gray-800/50 border border-green-400/20 rounded p-3 space-y-2"
                          >
                            <div className="flex items-center justify-between">
                              <div className="text-xs text-gray-400">{new Date(item.timestamp).toLocaleString()}</div>
                              <div className="flex items-center gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => toggleHistoryItemVisibility(item.id)}
                                  className="text-green-400 hover:text-green-300 h-6 w-6 p-0"
                                >
                                  {visibleHistoryItems.has(item.id) ? (
                                    <EyeOff className="w-3 h-3" />
                                  ) : (
                                    <Eye className="w-3 h-3" />
                                  )}
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => copyFromHistory(item.password)}
                                  className="text-cyan-400 hover:text-cyan-300 h-6 w-6 p-0"
                                >
                                  <Copy className="w-3 h-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeFromHistory(item.id)}
                                  className="text-red-400 hover:text-red-300 h-6 w-6 p-0"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>

                            <div className="font-mono text-sm break-all">
                              {visibleHistoryItems.has(item.id) ? item.password : "•".repeat(item.password.length)}
                            </div>

                            <div className="flex items-center gap-4 text-xs text-gray-400">
                              <span>Length: {item.length}</span>
                              <span>
                                Types:{" "}
                                {[
                                  item.options.uppercase && "ABC",
                                  item.options.lowercase && "abc",
                                  item.options.digits && "123",
                                  item.options.special && "!@#",
                                ]
                                  .filter(Boolean)
                                  .join(" ")}
                              </span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </DialogContent>
                </Dialog>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Generate Button */}
              <Button
                onClick={generateSecurePassword}
                disabled={isGenerating}
                className="w-full bg-green-400 hover:bg-green-300 text-black font-bold py-4 text-lg relative overflow-hidden group"
              >
                {isGenerating ? (
                  <div className="flex items-center gap-2">
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    GENERATING...
                  </div>
                ) : (
                  <>
                    <Zap className="w-5 h-5 mr-2" />
                    GENERATE PASSWORD
                  </>
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </Button>

              {/* Password Display */}
              {password && (
                <div className="space-y-4">
                  <div className="relative">
                    <div className="bg-black border border-green-400/50 rounded p-4 font-mono text-lg break-all">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-cyan-400 text-sm">GENERATED PASSWORD:</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowPassword(!showPassword)}
                          className="text-green-400 hover:text-green-300"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                      </div>
                      <div className="text-green-400">{showPassword ? password : "•".repeat(password.length)}</div>
                    </div>
                    <div className="absolute inset-0 bg-green-400/5 rounded animate-pulse" />
                  </div>

                  <Button
                    onClick={copyToClipboard}
                    variant="outline"
                    className="w-full border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    COPY TO CLIPBOARD
                  </Button>
                </div>
              )}

              {/* Security Notice */}
              <div className="bg-gray-800/50 border border-yellow-400/30 rounded p-4 text-xs">
                <div className="text-yellow-400 font-bold mb-1">⚠ SECURITY NOTICE</div>
                <div className="text-gray-300">
                  This password is generated using cryptographically secure random number generation. Store securely and
                  never share via unsecured channels.
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <style jsx>{`
        .matrix-bg {
          background-image: 
            linear-gradient(90deg, transparent 98%, rgba(0, 255, 0, 0.03) 100%),
            linear-gradient(180deg, transparent 98%, rgba(0, 255, 0, 0.03) 100%);
          background-size: 20px 20px;
          width: 100%;
          height: 100%;
          animation: matrix-scroll 20s linear infinite;
        }

        @keyframes matrix-scroll {
          0% { transform: translateY(0); }
          100% { transform: translateY(20px); }
        }

        .scan-lines {
          background: linear-gradient(
            transparent 50%,
            rgba(0, 255, 0, 0.03) 50%,
            rgba(0, 255, 0, 0.03) 51%,
            transparent 51%
          );
          background-size: 100% 4px;
          animation: scan 0.1s linear infinite;
        }

        @keyframes scan {
          0% { background-position: 0 0; }
          100% { background-position: 0 4px; }
        }

        .glitch-text {
          text-shadow: 
            0.05em 0 0 rgba(255, 0, 0, 0.75),
            -0.05em -0.025em 0 rgba(0, 255, 0, 0.75),
            0.025em 0.05em 0 rgba(0, 0, 255, 0.75);
          animation: glitch 2s infinite;
        }

        @keyframes glitch {
          0%, 100% { text-shadow: 0.05em 0 0 rgba(255, 0, 0, 0.75), -0.05em -0.025em 0 rgba(0, 255, 0, 0.75), 0.025em 0.05em 0 rgba(0, 0, 255, 0.75); }
          15% { text-shadow: 0.05em 0 0 rgba(255, 0, 0, 0.75), -0.05em -0.025em 0 rgba(0, 255, 0, 0.75), 0.025em 0.05em 0 rgba(0, 0, 255, 0.75); }
          16% { text-shadow: -0.05em -0.025em 0 rgba(255, 0, 0, 0.75), 0.025em 0.025em 0 rgba(0, 255, 0, 0.75), -0.05em -0.05em 0 rgba(0, 0, 255, 0.75); }
          49% { text-shadow: -0.05em -0.025em 0 rgba(255, 0, 0, 0.75), 0.025em 0.025em 0 rgba(0, 255, 0, 0.75), -0.05em -0.05em 0 rgba(0, 0, 255, 0.75); }
          50% { text-shadow: 0.025em 0.05em 0 rgba(255, 0, 0, 0.75), 0.05em 0 0 rgba(0, 255, 0, 0.75), 0 -0.05em 0 rgba(0, 0, 255, 0.75); }
          99% { text-shadow: 0.025em 0.05em 0 rgba(255, 0, 0, 0.75), 0.05em 0 0 rgba(0, 255, 0, 0.75), 0 -0.05em 0 rgba(0, 0, 255, 0.75); }
        }
      `}</style>
    </div>
  )
}
