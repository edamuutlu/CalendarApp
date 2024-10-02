USE [CalenderAppDb]
GO
INSERT [dbo].[Kullanicis] ([Id], [KullaniciAdi], [Isim], [Soyisim], [KullaniciSifresi]) VALUES (N'37b9f6e1-62af-4625-b95e-f386f28ac35c', N'murat', N'murat', N'murat', N'A8ic6Nh5G129ODeHSbL6nbAIyk3AnTqw8zmBX+PY7f8=')
INSERT [dbo].[Kullanicis] ([Id], [KullaniciAdi], [Isim], [Soyisim], [KullaniciSifresi]) VALUES (N'a25849fb-a109-4beb-a3a3-4a5b56593af4', N'nuri', N'nuri', N'nuri', N'tDDmQxmDzc4wRe/P9xT+dQES/9teVzV3D6rq2XN8e8k=')
INSERT [dbo].[Kullanicis] ([Id], [KullaniciAdi], [Isim], [Soyisim], [KullaniciSifresi]) VALUES (N'f3afb839-40e5-47eb-b054-122247f48d9a', N'eda', N'eda', N'eda', N'UA4wchoHAv07kCR7KNNSNh990R3GlWe3TXfS4KRZX+g=')
GO
SET IDENTITY_INSERT [dbo].[Etkinliks] ON 

INSERT [dbo].[Etkinliks] ([Id], [Baslik], [Aciklama], [BaslangicTarihi], [BitisTarihi], [TekrarDurumu], [OlusturanKullaniciId]) VALUES (80, N'd1', N'd1', CAST(N'2024-10-01T13:32:32.7260000' AS DateTime2), CAST(N'2024-10-03T09:00:32.7000000' AS DateTime2), 0, N'f3afb839-40e5-47eb-b054-122247f48d9a')
INSERT [dbo].[Etkinliks] ([Id], [Baslik], [Aciklama], [BaslangicTarihi], [BitisTarihi], [TekrarDurumu], [OlusturanKullaniciId]) VALUES (81, N'd2', N'd2', CAST(N'2024-10-02T11:00:32.7000000' AS DateTime2), CAST(N'2024-10-02T13:32:32.7260000' AS DateTime2), 0, N'f3afb839-40e5-47eb-b054-122247f48d9a')
INSERT [dbo].[Etkinliks] ([Id], [Baslik], [Aciklama], [BaslangicTarihi], [BitisTarihi], [TekrarDurumu], [OlusturanKullaniciId]) VALUES (82, N'd3', N'd3', CAST(N'2024-10-12T13:30:32.7000000' AS DateTime2), CAST(N'2024-10-14T14:30:32.7000000' AS DateTime2), 0, N'f3afb839-40e5-47eb-b054-122247f48d9a')
INSERT [dbo].[Etkinliks] ([Id], [Baslik], [Aciklama], [BaslangicTarihi], [BitisTarihi], [TekrarDurumu], [OlusturanKullaniciId]) VALUES (83, N'd4', N'd4', CAST(N'2024-10-17T15:00:32.7000000' AS DateTime2), CAST(N'2024-10-17T16:30:32.7000000' AS DateTime2), 2, N'f3afb839-40e5-47eb-b054-122247f48d9a')
INSERT [dbo].[Etkinliks] ([Id], [Baslik], [Aciklama], [BaslangicTarihi], [BitisTarihi], [TekrarDurumu], [OlusturanKullaniciId]) VALUES (84, N'd5', N'd5', CAST(N'2024-11-04T14:00:00.0000000' AS DateTime2), CAST(N'2024-11-04T15:00:00.0000000' AS DateTime2), 0, N'f3afb839-40e5-47eb-b054-122247f48d9a')
INSERT [dbo].[Etkinliks] ([Id], [Baslik], [Aciklama], [BaslangicTarihi], [BitisTarihi], [TekrarDurumu], [OlusturanKullaniciId]) VALUES (85, N'd6', N'd6', CAST(N'2024-12-02T15:46:54.9270000' AS DateTime2), CAST(N'2024-12-02T16:46:54.9270000' AS DateTime2), 0, N'f3afb839-40e5-47eb-b054-122247f48d9a')
SET IDENTITY_INSERT [dbo].[Etkinliks] OFF
GO
INSERT [dbo].[__EFMigrationsHistory] ([MigrationId], [ProductVersion]) VALUES (N'20240930084540_InitialCreate', N'8.0.5')
GO
