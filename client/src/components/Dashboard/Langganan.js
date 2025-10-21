'use client';
import { useState } from 'react';
import {
  CheckCircle,
  CreditCard,
  Server,
  Cloud,
  Coins,
  ArrowRight,
  X,
  Wallet,
  Smartphone,
  QrCode,
  BanknoteIcon,
  SmartphoneIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

const PaymentMethodCard = ({ method, onClick, isSelected }) => (
  <Card
    className={`cursor-pointer transition-all hover:shadow-md ${
      isSelected
        ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20'
        : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
    }`}
    onClick={onClick}
  >
    <CardContent className="p-4 flex items-center gap-4">
      <div
        className={`w-12 h-12 rounded-full flex items-center justify-center ${
          isSelected
            ? 'bg-blue-100 dark:bg-blue-900'
            : 'bg-gray-100 dark:bg-gray-700'
        }`}
      >
        {method.icon}
      </div>
      <div className="flex-1">
        <h3 className="font-semibold text-gray-900 dark:text-white">
          {method.name}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {method.description}
        </p>
      </div>
      {isSelected && <CheckCircle className="w-5 h-5 text-blue-500" />}
    </CardContent>
  </Card>
);

const SubscriptionPage = ({ user = token }) => {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const paymentMethods = [
    {
      id: 'dana',
      name: 'DANA',
      description: 'E-wallet populer di Indonesia',
      icon: <Wallet className="w-6 h-6 text-blue-500" />,
    },
    {
      id: 'bri',
      name: 'BRIMO',
      description: 'Bank BRI digital banking',
      icon: <BanknoteIcon className="w-6 h-6 text-green-500" />,
    },
    {
      id: 'ovo',
      name: 'OVO',
      description: 'E-wallet untuk mahasiswa',
      icon: <Smartphone className="w-6 h-6 text-purple-500" />,
    },
    {
      id: 'qris',
      name: 'QRIS',
      description: 'QR Code Payment System',
      icon: <QrCode className="w-6 h-6 text-orange-500" />,
    },
    {
      id: 'gopay',
      name: 'GoPay',
      description: 'E-wallet dari Gojek',
      icon: <SmartphoneIcon className="w-6 h-6 text-yellow-500" />,
    },
    {
      id: 'shopeepay',
      name: 'ShopeePay',
      description: 'E-wallet dari Shopee',
      icon: <SmartphoneIcon className="w-6 h-6 text-red-500" />,
    },
  ];

  const handleSubscribe = () => {
    setIsPaymentModalOpen(true);
  };

  const handleCancelSubscription = () => {
    setIsSubscribed(false);
  };

  const processPayment = async () => {
    if (!selectedPaymentMethod) return;

    setIsProcessingPayment(true);

    // Simulasi proses pembayaran
    setTimeout(() => {
      setIsSubscribed(true);
      setIsProcessingPayment(false);
      setIsPaymentModalOpen(false);
      setSelectedPaymentMethod(null);
    }, 3000);
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-10 font-mono">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col lg:flex-row">
            {/* Header */}
            <div className="text-center lg:text-left lg:w-1/2 py-10 lg:py-0 lg:mr-4">
              <h1 className="text-4xl font-bold text-gray-900 font-mono dark:text-white mb-4">
                Langganan Premium
              </h1>
              <p className="text-gray-600 dark:text-gray-300 font-mono lg:text-lg">
                Dukung pengembangan platform dengan berlangganan bulanan hanya
                3.000 Rupiah
              </p>
            </div>

            {/* Pricing Card */}
            <div className="relative">
              {/* Background decoration */}
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur-xl opacity-20"></div>

              <Card className="relative bg-white dark:bg-gray-800 border-0 shadow-xl m-0 p-0 rounded-2xl overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-1  ">
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-8">
                    {/* Price Display */}
                    <div
                      className=" flex gap-10 items-center justify-center flex-col lg:flex-row
                  "
                    >
                      {' '}
                      <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-full mb-4">
                          <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                            Rp
                          </span>
                        </div>
                        <h2 className="text-5xl font-bold text-gray-900 dark:text-white mb-2">
                          3.000
                        </h2>
                        <p className="text-xl text-gray-600 dark:text-gray-300">
                          per bulan
                        </p>
                      </div>
                      {/* Features */}
                      <div className="space-y-4 mb-8">
                        <div className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-green-500" />
                          <span className="text-gray-700 dark:text-gray-300">
                            Akses semua fitur premium
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-green-500" />
                          <span className="text-gray-700 dark:text-gray-300">
                            Prioritas dukungan teknis
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-green-500" />
                          <span className="text-gray-700 dark:text-gray-300">
                            Akses eksklusif ke konten premium
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* CTA Button */}
                    <div className="mb-8">
                      {isSubscribed ? (
                        <div className="space-y-4">
                          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                            <div className="flex items-center gap-3">
                              <CheckCircle className="w-6 h-6 text-green-500" />
                              <div>
                                <h3 className="font-semibold text-green-800 dark:text-green-300">
                                  Berlangganan Aktif
                                </h3>
                                <p className="text-sm text-green-600 dark:text-green-400">
                                  Anda berlangganan hingga{' '}
                                  {new Date(
                                    Date.now() + 30 * 24 * 60 * 60 * 1000
                                  ).toLocaleDateString('id-ID')}
                                </p>
                              </div>
                            </div>
                          </div>
                          <Button
                            onClick={handleCancelSubscription}
                            variant="outline"
                            className="w-full"
                          >
                            Batalkan Langganan
                          </Button>
                        </div>
                      ) : (
                        <Dialog
                          open={isPaymentModalOpen}
                          onOpenChange={setIsPaymentModalOpen}
                        >
                          <DialogTrigger asChild>
                            <Button
                              onClick={handleSubscribe}
                              disabled={isLoading}
                              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold text-lg py-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                            >
                              {isLoading ? (
                                <div className="flex items-center gap-2">
                                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                  <span>Memproses...</span>
                                </div>
                              ) : (
                                'Mulai Berlangganan'
                              )}
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Pilih Metode Pembayaran</DialogTitle>
                              <DialogDescription>
                                Pilih metode pembayaran yang Anda inginkan untuk
                                melanjutkan langganan
                              </DialogDescription>
                            </DialogHeader>

                            <div className="space-y-4">
                              <div>
                                <h3 className="text-lg font-semibold mb-4">
                                  Metode Pembayaran Tersedia
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  {paymentMethods.map((method) => (
                                    <PaymentMethodCard
                                      key={method.id}
                                      method={method}
                                      onClick={() =>
                                        setSelectedPaymentMethod(method)
                                      }
                                      isSelected={
                                        selectedPaymentMethod?.id === method.id
                                      }
                                    />
                                  ))}
                                </div>
                              </div>

                              {selectedPaymentMethod && (
                                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                  <div className="flex items-center gap-3">
                                    {selectedPaymentMethod.icon}
                                    <div>
                                      <h4 className="font-semibold text-blue-900 dark:text-blue-100">
                                        {selectedPaymentMethod.name}
                                      </h4>
                                      <p className="text-sm text-blue-700 dark:text-blue-300">
                                        Anda akan diarahkan ke aplikasi{' '}
                                        {selectedPaymentMethod.name}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              )}

                              <div className="flex justify-end gap-3 pt-4">
                                <Button
                                  variant="outline"
                                  onClick={() => setIsPaymentModalOpen(false)}
                                >
                                  Batal
                                </Button>
                                <Button
                                  onClick={processPayment}
                                  disabled={
                                    !selectedPaymentMethod ||
                                    isProcessingPayment
                                  }
                                  className="bg-blue-600 hover:bg-blue-700"
                                >
                                  {isProcessingPayment ? (
                                    <div className="flex items-center gap-2">
                                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                      <span>Memproses...</span>
                                    </div>
                                  ) : (
                                    'Bayar Sekarang'
                                  )}
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      )}
                    </div>

                    {/* Payment Methods */}
                    <div className="flex items-center justify-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                      <CreditCard className="w-5 h-5" />
                      <span>Pembayaran aman dengan berbagai metode</span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Cost Breakdown Section */}
          <div className="mt-16 bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 md:p-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Mengapa Langganan Penting?
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Setiap kontribusi Anda membantu menjaga platform tetap berjalan
                dan berkembang
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              {/* Server Cost */}
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-0">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Server className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold text-blue-900 dark:text-blue-100">
                    Biaya Server
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    Biaya hosting dan maintenance server untuk menjaga platform
                    tetap online 24/7
                  </p>
                  <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    ~40% dari total biaya
                  </Badge>
                </CardContent>
              </Card>

              {/* Cloud Cost */}
              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-0">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Cloud className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold text-purple-900 dark:text-purple-100">
                    Biaya Cloud
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    Pemeliharaan infrastruktur cloud dan layanan terkait
                  </p>
                  <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                    ~40% dari total biaya
                  </Badge>
                </CardContent>
              </Card>

              {/* NFT Fees */}
              <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20 border-0">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Coins className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold text-indigo-900 dark:text-indigo-100">
                    Biaya NFT
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    Mint NFT dan transfer NFT untuk operasional Top Contributor
                  </p>
                  <Badge className="bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
                    ~20% dari total biaya
                  </Badge>
                </CardContent>
              </Card>
            </div>

            {/* Additional Info */}
            <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 hidden md:inline-block">
                  <ArrowRight className="w-6 h-6 text-blue-500 mt-1" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Transparansi Biaya
                  </h3>
                  <div className="text-gray-600 dark:text-gray-300">
                    Setiap 3.000 Rupiah yang Anda bayarkan akan digunakan untuk:
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      <li>Maintenance server dan infrastruktur</li>
                      <li>Biaya cloud storage dan processing</li>
                      <li>Operasional smart contract NFT</li>
                      <li>Support dan pengembangan fitur baru</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Student Note */}
          <div className="mt-8 p-6 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 hidden md:inline-block">
                <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">M</span>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                  Khusus Mahasiswa
                </h3>
                <p className="text-yellow-700 dark:text-yellow-300">
                  Sebagai mahasiswa, Anda mendapatkan akses ke semua fitur
                  premium dengan harga terjangkau. Langganan ini membantu
                  pengembangan platform yang fokus pada kebutuhan akademik dan
                  kreativitas mahasiswa.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPage;
