import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Package, Plus, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface Product {
  product_id: string;
  name: string;
  description: string;
  price: number;
  stock_quantity: number;
  stock_status: string;
  supplier_id?: string;
  category?: string;
  image_url?: string;
}

const Inventory = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newProduct, setNewProduct] = useState({
    product_id: '',
    name: '',
    description: '',
    price: '',
    stock_quantity: '',
    category: '',
    supplier_id: 'SUP001',
    image_url: '/placeholder.svg',
  });

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('http://localhost:4000/products');
        if (!res.ok) throw new Error('Failed to fetch products');
        const data = await res.json();
        setProducts(data);
      } catch (e) {
        console.error(e);
        toast.error('Failed to load inventory');
      }
    })();
  }, []);

  const getAutoStockStatus = (quantity: number): string => {
    if (quantity === 0) return 'out_of_stock';
    if (quantity < 30) return 'low_stock';
    if (quantity < 50) return 'medium';
    return 'in_stock';
  };

  const handleAddProduct = async () => {
    // Validate required fields
    const { product_id, name, price, stock_quantity } = newProduct;
    if (!product_id?.trim() || !name?.trim() || price === '' || stock_quantity === '') {
      toast.error("Product ID, Name, Price, and Stock Quantity are required.");
      return;
    }

    const payload = {
      ...newProduct,
      product_id: newProduct.product_id.trim(),
      name: newProduct.name.trim(),
      price: parseFloat(String(newProduct.price)),
      stock_quantity: parseInt(String(newProduct.stock_quantity), 10),
      description: newProduct.description || "",
      stock_status: getAutoStockStatus(parseInt(String(newProduct.stock_quantity), 10)),
      image_url: newProduct.image_url || "/placeholder.svg",
    };
    try {
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
        product_id: '',
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
      const qty = Number(editingProduct.stock_quantity) || 0;
      const updated = {
        ...editingProduct,
        stock_status: getAutoStockStatus(qty),
        price: Number(editingProduct.price) || 0,
        stock_quantity: qty,
      };
      const res = await fetch(`http://localhost:4000/products/${editingProduct.product_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
      if (!res.ok) throw new Error('Failed to update product');
      const saved = await res.json();
      setProducts((prev) => prev.map((p) => p.product_id === saved.product_id ? saved : p));
      setIsEditDialogOpen(false);
      setEditingProduct(null);
      toast.success('Product updated');
    } catch (e) {
      console.error(e);
      toast.error('Failed to update product');
    }
  };

  const handleDeleteProduct = async (id?: string) => {
    if (!id) {
      toast.error('Invalid product ID');
      return;
    }
    try {
      const res = await fetch(`http://localhost:4000/products/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete product');
      setProducts((prev) => prev.filter((p) => p.product_id !== id));
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
          <p className="text-muted-foreground">Manage and track your products</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="mr-2 h-4 w-4" /> Add Product</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Product</DialogTitle>
              <DialogDescription>Enter details for the new product</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {/* Product ID */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Product ID</Label>
                <Input className="col-span-3" value={newProduct.product_id} required
                  onChange={e => setNewProduct(p => ({ ...p, product_id: e.target.value }))}
                  placeholder="e.g. P1050" />
              </div>
              {/* Name */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Name</Label>
                <Input className="col-span-3" value={newProduct.name} required
                  onChange={e => setNewProduct(p => ({ ...p, name: e.target.value }))}
                  placeholder="Product Name" />
              </div>
              {/* Description */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Description</Label>
                <Textarea className="col-span-3"
                  value={newProduct.description}
                  onChange={e => setNewProduct(p => ({ ...p, description: e.target.value }))}
                  placeholder="Description" />
              </div>
              {/* Price */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Price</Label>
                <Input className="col-span-3" type="number"
                  value={newProduct.price}
                  onChange={e => setNewProduct(p => ({ ...p, price: e.target.value }))}
                  placeholder="0.00" />
              </div>
              {/* Stock Quantity */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Stock Quantity</Label>
                <Input className="col-span-3" type="number"
                  value={newProduct.stock_quantity}
                  onChange={e => setNewProduct(p => ({ ...p, stock_quantity: e.target.value }))}
                  placeholder="0" />
              </div>
              {/* Category */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Category</Label>
                <Input className="col-span-3"
                  value={newProduct.category}
                  onChange={e => setNewProduct(p => ({ ...p, category: e.target.value }))}
                  placeholder="Category" />
              </div>
              {/* Image URL */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Image URL</Label>
                <Input className="col-span-3"
                  value={newProduct.image_url}
                  onChange={e => setNewProduct(p => ({ ...p, image_url: e.target.value }))}
                  placeholder="/placeholder.svg" />
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
                <TableHead>Product ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((p, idx) => (
                <TableRow key={p.product_id ?? idx}>
                  <TableCell>{p.product_id}</TableCell>
                  <TableCell>{p.name}</TableCell>
                  <TableCell>{p.category || '-'}</TableCell>
                  <TableCell>₹{(Number(p.price) || 0).toFixed(2)}</TableCell>
                  <TableCell>{p.stock_quantity ?? 0}</TableCell>
                  <TableCell>
                    <Badge variant={
                      p.stock_status === 'out_of_stock'
                        ? 'destructive'
                        : p.stock_status === 'low_stock'
                          ? 'secondary'
                          : 'default'
                    }>
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
      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>Modify stock or price</DialogDescription>
          </DialogHeader>
          {editingProduct && (
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input disabled value={editingProduct.name} />
              </div>
              <div className="space-y-2">
                <Label>Price</Label>
                <Input type="number" value={editingProduct.price} onChange={(e) => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) })} />
              </div>
              <div className="space-y-2">
                <Label>Stock Quantity</Label>
                <Input type="number" value={editingProduct.stock_quantity} onChange={(e) => setEditingProduct({ ...editingProduct, stock_quantity: parseInt(e.target.value) })} />
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
