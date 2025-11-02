import { useState, useEffect } from 'react';
import { Product } from '@/types/database';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Package, AlertTriangle, TrendingUp, Plus, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

const Inventory = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    stock_quantity: '',
    category: '',
    supplier_id: 'SUP001',
    image_url: '/placeholder.svg',
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('http://localhost:4000/products');
        if (!res.ok) throw new Error('Failed to fetch products');
        const data = await res.json();
        setProducts(data);
      } catch (e) {
        console.error(e);
        toast.error('Failed to load inventory');
      }
    };
    fetchProducts();
  }, []);

  const getAutoStockStatus = (quantity: number): Product['stock_status'] => {
    if (quantity === 0) return 'out_of_stock';
    if (quantity < 30) return 'low_stock';
    if (quantity < 50) return 'medium';
    return 'in_stock';
  };

  const handleAddProduct = async () => {
    try {
      const payload = {
        ...newProduct,
        price: parseFloat(String(newProduct.price || 0)),
        stock_quantity: parseInt(String(newProduct.stock_quantity || 0), 10),
        stock_status: getAutoStockStatus(parseInt(String(newProduct.stock_quantity || 0), 10)),
      } as any;

      const res = await fetch('http://localhost:4000/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Failed to add product');
      const created = await res.json();
      setProducts(prev => [...prev, created]);
      setIsAddDialogOpen(false);
      setNewProduct({
        name: '', description: '', price: '', stock_quantity: '', category: '', supplier_id: 'SUP001', image_url: '/placeholder.svg'
      });
      toast.success('Product added');
    } catch (e) {
      console.error(e);
      toast.error('Failed to add product');
    }
  };

  const handleEditProduct = async () => {
    if (!editingProduct) return;
    try {
      const updated = {
        ...editingProduct,
        stock_status: getAutoStockStatus(editingProduct.stock_quantity),
      };
      const res = await fetch(`http://localhost:4000/products/${editingProduct.product_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
      if (!res.ok) throw new Error('Failed to update product');
      const saved = await res.json();
      setProducts(prev => prev.map(p => p.product_id === saved.product_id ? saved : p));
      setIsEditDialogOpen(false);
      setEditingProduct(null);
      toast.success('Product updated');
    } catch (e) {
      console.error(e);
      toast.error('Failed to update product');
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      const res = await fetch(`http://localhost:4000/products/${productId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete product');
      setProducts(prev => prev.filter(p => p.product_id !== productId));
      toast.success('Product deleted');
    } catch (e) {
      console.error(e);
      toast.error('Failed to delete product');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Inventory</h1>
          <p className="text-muted-foreground">Manage your store products</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Add Product
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Product</DialogTitle>
              <DialogDescription>Fill details to add a new product</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Name</Label>
                <Input className="col-span-3" value={newProduct.name} onChange={(e) => setNewProduct(p => ({...p, name: e.target.value}))} />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Description</Label>
                <Textarea className="col-span-3" value={newProduct.description} onChange={(e) => setNewProduct(p => ({...p, description: e.target.value}))} />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Price</Label>
                <Input type="number" step="0.01" className="col-span-3" value={newProduct.price} onChange={(e) => setNewProduct(p => ({...p, price: e.target.value}))} />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Stock Qty</Label>
                <Input type="number" className="col-span-3" value={newProduct.stock_quantity} onChange={(e) => setNewProduct(p => ({...p, stock_quantity: e.target.value}))} />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Category</Label>
                <Input className="col-span-3" value={newProduct.category} onChange={(e) => setNewProduct(p => ({...p, category: e.target.value}))} />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Image URL</Label>
                <Input className="col-span-3" value={newProduct.image_url} onChange={(e) => setNewProduct(p => ({...p, image_url: e.target.value}))} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleAddProduct}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Package className="h-5 w-5" /> Products</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((p) => (
                <TableRow key={p.product_id}>
                  <TableCell className="font-medium">{p.name}</TableCell>
                  <TableCell>{p.category}</TableCell>
                  <TableCell>${p.price.toFixed ? p.price.toFixed(2) : Number(p.price).toFixed(2)}</TableCell>
                  <TableCell>{p.stock_quantity}</TableCell>
                  <TableCell>
                    <Badge variant={p.stock_status === 'out_of_stock' ? 'destructive' : p.stock_status === 'low_stock' ? 'secondary' : 'default'}>
                      {p.stock_status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="outline" size="icon" onClick={() => { setEditingProduct(p); setIsEditDialogOpen(true); }}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="icon">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete product?</AlertDialogTitle>
                          <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDeleteProduct(p.product_id)}>Delete</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Product Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>Update price and stock quantity</DialogDescription>
          </DialogHeader>
          {editingProduct && (
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label>Product Name</Label>
                <Input value={editingProduct.name} disabled />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-price">Price</Label>
                <Input id="edit-price" type="number" step="0.01" value={editingProduct.price}
                  onChange={(e) => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-stock">Stock Quantity</Label>
                <Input id="edit-stock" type="number" value={editingProduct.stock_quantity}
                  onChange={(e) => setEditingProduct({ ...editingProduct, stock_quantity: parseInt(e.target.value, 10) })}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleEditProduct}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Inventory;
